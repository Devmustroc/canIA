"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useSubscriptionsModal} from "@/features/subscriptions/store/use-subscriptions-modal";
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import {CheckCircle2 } from "lucide-react";
import {Button} from "@/components/ui/button";
import {useCheckout} from "@/features/subscriptions/hooks/use-checkout";

const SubscriptionModal = () => {
    const mutation = useCheckout();
    const {isOpen,onClose } = useSubscriptionsModal();
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                <DialogHeader
                    className="flex items-center space-y-4"
                >
                    <Image
                        src="/images/logo.svg"
                        alt="subscription"
                        width={100}
                        height={100}
                    />
                    <DialogTitle
                        className="text-lg font-semibold"
                    >
                        Upgrade your account
                    </DialogTitle>
                    <DialogDescription
                        className="text-sm text-center"
                    >
                        upgrade your account to unlock all the features including IA generated content
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <ul
                    className="space-y-4"
                >
                    <li
                        className="flex items-center"
                    >
                        <CheckCircle2
                            size={24}
                            className="text-white fill-[#442781] mr-2 "
                        />
                        <p
                            className="text-muted-foreground text-sm"
                        >
                            Unlimited new premium templates
                        </p>
                    </li>
                    <li
                        className="flex items-center"
                    >
                        <CheckCircle2
                            size={24}
                            className="text-white fill-[#442781] mr-2 "
                        />
                        <p
                            className="text-muted-foreground text-sm"
                        >
                            Generate content with prompts Using Latest AI Models
                        </p>
                    </li>
                    <li
                        className="flex items-center"
                    >
                        <CheckCircle2
                            size={24}
                            className="text-white fill-[#442781] mr-2 "
                        />
                        <p
                            className="text-muted-foreground text-sm"
                        >
                            Scale and enhance your images and templates
                        </p>
                    </li>
                    <li
                        className="flex items-center"
                    >
                        <CheckCircle2
                            size={24}
                            className="text-white fill-[#442781] mr-2 "
                        />
                        <p
                            className="text-muted-foreground text-sm"
                        >
                            Remove background from images
                        </p>
                    </li>
                    <li
                        className="flex items-center"
                    >
                        <CheckCircle2
                            size={24}
                            className="text-white fill-[#442781] mr-2 "
                        />
                        <p
                            className="text-muted-foreground text-sm"
                        >
                            Make your own Stickers using our fine-tuned AI models
                        </p>
                    </li>
                </ul>
                <DialogFooter
                    className="pt-2 mt-2 gap-y-2"
                >
                    <Button
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate()}
                        className="w-full"
                    >
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionModal;