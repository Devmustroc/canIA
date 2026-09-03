import React from 'react';
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <Link href={'/'}>
            <div
                className="size-8 relative shrink-0"
            >
                <Image
                    src="/images/logo.svg"
                    alt="logo"
                    width={32}
                    height={32}
                    className="shrink-0 hover:opacity-75 transition duration-300"
                />
            </div>
        </Link>
    );
};

export default Logo;