/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
    },
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "react-icons",
            "@radix-ui/react-icons",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@clerk/nextjs",
            "date-fns",
            "lodash.debounce",
        ],
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "images.unsplash.com",
            },
            {
                protocol: 'https',
                hostname: 'replicate.delivery',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
            }
        ]
    }
};

export default nextConfig;
