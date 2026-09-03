import  { create } from "zustand";

type UseFailModalStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useFailSubscriptionModal = create<UseFailModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));