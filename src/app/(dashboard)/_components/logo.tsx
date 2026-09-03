import React from 'react';
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <Link
            href="/"
        >
            <div
                className="flex items-center gap-x-2.5 hover:opacity-85 transition h-[64px] px-4 cursor-pointer"
            >
                <div
                    className="size-8 relative items-center justify-center flex shrink-0"
                >
                    <Image
                        src="/images/logo.svg"
                        alt="CanIA Logo"
                        fill
                        priority
                    />
                </div>
                <span
                    className="text-2xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-sans"
                >
                    CanIA
                </span>
            </div>
        </Link>
    );
};

export default Logo;