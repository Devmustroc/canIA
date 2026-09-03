import  { create } from "zustand";

type usSuccessModal = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useSuccessModal = create<usSuccessModal>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));