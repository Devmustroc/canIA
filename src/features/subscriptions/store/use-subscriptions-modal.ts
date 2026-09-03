import  { create } from "zustand";

type UseSubscriptionsModalState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useSubscriptionsModal = create<UseSubscriptionsModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));