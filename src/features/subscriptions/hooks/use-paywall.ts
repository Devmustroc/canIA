import {useSubscriptionsModal} from "@/features/subscriptions/store/use-subscriptions-modal";
import {useGetSubscription} from "@/features/subscriptions/hooks/use-get-subscription";

export const usePaywall = () => {
    const {
        data: subscription,
        isLoading: isLoadingSubscription
    } = useGetSubscription();
    const subscriptionModal = useSubscriptionsModal();

    const shouldBeBlock = isLoadingSubscription || !subscription?.active;

    return {
        isLoading: isLoadingSubscription,
        shouldBeBlock,
        triggerPaywall: () => {
            subscriptionModal.onOpen();
        }
    }
}