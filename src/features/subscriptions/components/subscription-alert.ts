"use client"

import {useFailSubscriptionModal} from "@/features/subscriptions/store/use-fail-modal";
import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useSuccessModal} from "@/features/subscriptions/store/use-success-modal";

export const SubscriptionAlert = () => {
    const params = useSearchParams();
    const { onOpen: onOpenFail } = useFailSubscriptionModal();
    const { onOpen: onOpenSuccess } = useSuccessModal();

    const canceled = params.get("canceled");
    const success = params.get("success");

    useEffect(() => {
        if (canceled) {
            onOpenFail();
        }
        if (success) {
            onOpenSuccess();
        }
    }, [canceled, onOpenFail, success, onOpenSuccess]);

    return null
}