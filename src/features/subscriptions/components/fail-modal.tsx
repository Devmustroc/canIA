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
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useCheckout} from "@/features/subscriptions/hooks/use-checkout";
import {useFailSubscriptionModal} from "@/features/subscriptions/store/use-fail-modal";
import {useRouter} from "next/navigation";

const FailModal = () => {
    const router = useRouter();
    const mutation = useCheckout();
    const {isOpen,onClose } = useFailSubscriptionModal();

    const handleClose = () => {
        router.replace("/");
        onClose();
    }
    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleClose}
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
                        Something went wrong
                    </DialogTitle>
                    <DialogDescription
                        className="text-sm text-center"
                    >
                        We are unable to process your payment. Please try again later.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <DialogFooter
                    className="pt-2 mt-2 gap-y-2"
                >
                    <Button
                        disabled={mutation.isPending}
                        onClick={handleClose}
                        className="w-full"
                    >
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FailModal;