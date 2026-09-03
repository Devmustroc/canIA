'use client';

import React from 'react';
import { UserButton as ClerkUserButton, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

const UserButton = () => {
    const { isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return (
            <Loader2
                className="size-6 animate-spin text-muted-foreground"
            />
        );
    }

    if (!isSignedIn) {
        return null;
    }

    return (
        <ClerkUserButton
            appearance={{
                elements: {
                    avatarBox: "size-10"
                }
            }}
        />
    );
};

export default UserButton;