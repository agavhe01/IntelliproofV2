import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { ArgumentGraph } from '../../types/graph';

interface GraphManagerProps {
    onSelectGraph: (graph: ArgumentGraph) => void;
    onNewGraph: () => void;
}

export default function GraphManager({ onSelectGraph, onNewGraph }: GraphManagerProps) {
    console.log('GraphManager component rendering');

    const [graphs, setGraphs] = useState<Array<{ id: string; graph_data: ArgumentGraph }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('GraphManager mounted');
        loadGraphs();
        return () => {
            console.log('GraphManager unmounted');
        };
    }, []);

    const loadGraphs = async () => {
        console.log('Loading graphs...');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log('No user found');
                return;
            }

            const { data, error } = await supabase
                .from('graphs')
                .select('*')
                .eq('owner_email', user.email);

            if (error) {
                console.error('Error loading graphs:', error);
                return;
            }

            console.log('Graphs loaded:', data);
            setGraphs(data || []);
        } catch (error) {
            console.error('Error in loadGraphs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGraph = (graph: { id: string; graph_data: ArgumentGraph }) => {
        console.log('Selected graph:', graph);
        onSelectGraph(graph.graph_data);
    };

    console.log('Current state:', { loading, graphsCount: graphs.length });

    if (loading) {
        return <div className="text-white p-4">Loading graphs...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Your Graphs</h2>
                <button
                    onClick={onNewGraph}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    New Graph
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {graphs.map((graph) => (
                    <div
                        key={graph.id}
                        className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition-colors cursor-pointer"
                        onClick={() => handleSelectGraph(graph)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-medium">
                                {graph.graph_data.nodes.length} nodes
                            </h3>
                        </div>
                        <div className="mt-2 text-sm text-zinc-300">
                            {graph.graph_data.edges.length} connections
                        </div>
                    </div>
                ))}
            </div>

            {graphs.length === 0 && (
                <div className="text-center text-zinc-400 py-8">
                    No graphs yet. Create your first graph!
                </div>
            )}
        </div>
    );
} 