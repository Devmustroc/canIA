"use client"

import React from 'react';
import {QueryProviders} from "@/components/providers/query-provider";

interface ProvidersProps {
    children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
    return (
        <QueryProviders>
            { children }
        </QueryProviders>
    );
};

export default Providers;