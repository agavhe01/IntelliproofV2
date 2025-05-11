"use client";

import React from 'react';

export default function GraphLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            {children}
        </div>
    );
} 