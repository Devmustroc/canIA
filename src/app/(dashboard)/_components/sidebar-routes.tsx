'use client';

import React from 'react';
import {CreditCard, Crown, Home, MessageCircleQuestion} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import {usePathname} from "next/navigation";
import {usePaywall} from "@/features/subscriptions/hooks/use-paywall";
import {Button} from "@/components/ui/button";
import {useCheckout} from "@/features/subscriptions/hooks/use-checkout";
import {useBilling} from "@/features/subscriptions/hooks/use-billing";




const SidebarRoutes = () => {
    const { shouldBeBlock, triggerPaywall, isLoading} = usePaywall();
    const billingMutation = useBilling();
    const mutation = useCheckout();
    const pathname = usePathname();

    const onClick = () => {
        if (shouldBeBlock) {
            triggerPaywall();
            return
        }
        billingMutation.mutate();
    }

    return (
        <div className="flex flex-col gap-y-4 flex-1 mt-12">
            {shouldBeBlock && !isLoading && (
                <>
                    <div className="px-3">
                        <Button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                            className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
                            variant="outline"
                            size="lg"
                        >
                            <Crown className="mr-2 size-4 fill-[#442781] text-[#442781]" />
                            Upgrade to Image AI Pro
                        </Button>
                    </div>
                    <div className="px-3">
                        <Separator />
                    </div>
                </>
            )}
            <ul className="flex flex-col gap-y-1 px-3">
                <SidebarItem
                    href="/"
                    icon={Home}
                    label="Home"
                    isActive={pathname === "/"}
                />
            </ul>
            <div className="px-3">
                <Separator />
            </div>
            <ul className="flex flex-col gap-y-1 px-3">
                <SidebarItem
                    href={pathname}
                    icon={CreditCard}
                    label="Billing"
                    onClick={onClick}
                />
                <SidebarItem
                    href="mailto:elmustapha.abourar@gmail.com"
                    icon={MessageCircleQuestion}
                    label="Get Help"
                />
            </ul>
        </div>
    )
};

export default SidebarRoutes;