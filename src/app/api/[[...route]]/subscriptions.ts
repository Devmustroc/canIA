import { Hono } from "hono";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkIsActive } from "@/features/subscriptions/lib/utils";
import { getAuthUserId } from "@/lib/auth";

const app = new Hono()
    .post('/billing', async (c) => {
        const userId = await getAuthUserId(c);

        if (!userId) {
            return c.json({ error: 'Not authenticated' }, 401);
        }

        const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId));

        if (!subscription) {
            return c.json({ error: 'Subscription not found' }, 404);
        }

        try {
            const session = await stripe.billingPortal.sessions.create({
                customer: subscription.customerId,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}`
            });

            if (!session.url) {
                return c.json({ error: 'Error creating billing portal session' }, 400);
            }

            return c.json({ data: session.url });
        } catch (err: any) {
            console.error("Stripe billing portal error:", err?.message);
            return c.json({ error: 'Service de facturation indisponible' }, 503);
        }
    })
    .get('/current', async (c) => {
        const userId = await getAuthUserId(c);

        if (!userId) {
            return c.json({ error: 'Not authenticated' }, 401);
        }

        const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId));

        const active = checkIsActive(subscription);

        return c.json({
            data: {
                active,
                ...subscription
            }
        });
    })
    .post('/checkout', async (c) => {
        const userId = await getAuthUserId(c);

        if (!userId) {
            return c.json({ error: 'Not authenticated' }, 401);
        }

        try {
            const session = await stripe.checkout.sessions.create({
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=1`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`,
                payment_method_types: ["card", "paypal"],
                mode: "subscription",
                billing_address_collection: "auto",
                line_items: [
                    {
                        price: process.env.STRIPE_PRICE_ID,
                        quantity: 1
                    }
                ],
                metadata: {
                    userId: userId
                }
            });

            const url = session.url;

            if (!url) {
                return c.json({ error: `Error creating checkout session` }, 400);
            }

            return c.json({ data: url });
        } catch (err: any) {
            console.error("Stripe checkout error:", err?.message);
            return c.json({ error: 'Service de paiement indisponible ou clé Stripe non configurée' }, 503);
        }
    })
    .post('/webhook', async (c) => {
        const body = await c.req.text();
        const signature = c.req.header('Stripe-Signature') as string;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (error) {
            return c.json({ error: "invalid signature" }, 400);
        }

        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === 'checkout.session.completed') {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

            if (!session?.metadata?.userId) {
                return c.json({ error: 'User not found' }, 404);
            }

            await db
                .insert(subscriptions)
                .values({
                    userId: session.metadata.userId,
                    subscriptionId: subscription.id,
                    status: subscription.status,
                    customerId: subscription.customer as string,
                    priceId: subscription.items.data[0].price.product as string,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
        }

        if (event.type === 'invoice.payment_succeeded') {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

            if (!session?.metadata?.userId) {
                return c.json({ error: 'User not found' }, 404);
            }

            await db
                .update(subscriptions)
                .set({
                    status: subscription.status,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    updatedAt: new Date()
                })
                .where(eq(subscriptions.id, subscription.id));
        }
        return c.json(null, 200);
    });

export default app;