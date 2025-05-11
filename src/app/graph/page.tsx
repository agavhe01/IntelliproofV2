"use client";

import dynamic from 'next/dynamic';

const GraphEditor = dynamic(() => import('../components/graph/GraphEditor'), {
    ssr: false,
    loading: () => <div className="text-white p-4">Loading Graph Editor...</div>
});

export default function GraphPage() {
    console.log('GraphPage rendering');

    return (
        <div className="min-h-screen bg-black">
            <div className="h-screen">
                <GraphEditor />
            </div>
        </div>
    );
} 