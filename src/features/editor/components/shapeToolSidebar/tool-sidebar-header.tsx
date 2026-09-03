import React from 'react';

interface ToolSidebarHeaderProps {
    title: string;
    description?: string;
}

const ToolSidebarHeader = ({
    title,
    description,
}: ToolSidebarHeaderProps) => {
    return (
        <div
            className="p-4 space-y-1 border-b h-[74px] shadow-sm shadow-blur-lg"
        >
            <p
                className="text-md font-bold"
            >
                {title}
            </p>
            {
                description && (
                    <p
                        className="text-sm text-muted-foreground"
                    >
                        {description}
                    </p>
                )
            }
        </div>
    );
};

export default ToolSidebarHeader;