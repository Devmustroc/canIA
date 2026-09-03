import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";


const useConfirm = (
    title: string,
    message: string
): [() => JSX.Element, () => Promise<unknown>] => {
    const [confirm, setConfirm] = useState<
        { resolve: (value: boolean) => void, } | null
    >(null);

    const onConfirm = () =>  new Promise((resolve, reject) => {
        setConfirm({ resolve });
    })

    const handleClose = () => {
        setConfirm(null);
    }

    const handleConfirm = () => {
        confirm?.resolve(true);
        handleClose();
    }

    const handleCancel = () => {
        confirm?.resolve(false);
        handleClose();
    }

    const ConfirmationDialog = () => {
        return (
            <Dialog
                open={!!confirm}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                        <DialogDescription>
                            {message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter
                        className="justify-end pt-2"
                    >
                        <Button
                            variant={"ghost"}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return [ConfirmationDialog, onConfirm];
};

export default useConfirm;