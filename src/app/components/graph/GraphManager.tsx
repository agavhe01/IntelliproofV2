import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { ArgumentGraph } from '../../types/graph';
import { Modal } from '../Modal';
import Image from 'next/image';
import { format } from 'date-fns';

interface GraphManagerProps {
    onSelectGraph: (graph: ArgumentGraph) => void;
    onNewGraph: () => void;
}

interface GraphData {
    id: string;
    name?: string;
    graph_data: ArgumentGraph;
    created_at: string;
    updated_at: string;
    owner_email: string;
}

export default function GraphManager({ onSelectGraph, onNewGraph }: GraphManagerProps) {
    const [graphs, setGraphs] = useState<GraphData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGraph, setSelectedGraph] = useState<GraphData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        console.log('GraphManager mounted');
        loadGraphs();
    }, []);

    const loadGraphs = async () => {
        console.log('Loading graphs...');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Current user:', user);

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

    const handleSelectGraph = (graph: GraphData) => {
        console.log('Selected graph:', graph);
        setSelectedGraph(graph);
    };

    const handleOpenGraph = () => {
        if (selectedGraph) {
            const graphWithName = {
                ...selectedGraph.graph_data,
                name: selectedGraph.name
            };
            onSelectGraph(graphWithName);
            setSelectedGraph(null);
        }
    };

    const handleDeleteGraph = async (graphId: string) => {
        if (!confirm('Are you sure you want to delete this graph? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('graphs')
                .delete()
                .eq('id', graphId);

            if (error) {
                console.error('Error deleting graph:', error);
                alert('Failed to delete graph. Please try again.');
                return;
            }

            // Remove the deleted graph from the local state
            setGraphs(graphs.filter(g => g.id !== graphId));
            setSelectedGraph(null);
        } catch (error) {
            console.error('Error in handleDeleteGraph:', error);
            alert('An error occurred while deleting the graph.');
        } finally {
            setIsDeleting(false);
        }
    };

    console.log('Current state:', { loading, graphsCount: graphs.length, graphs });

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
                {graphs.map((graph) => {
                    console.log('Rendering graph:', graph);
                    return (
                        <div key={graph.id}>
                            <div
                                className="relative w-[400px] h-auto rounded-lg overflow-hidden cursor-pointer"
                                style={{ aspectRatio: "3/2" }}
                                onClick={() => handleSelectGraph(graph)}
                            >
                                <Image
                                    className="absolute w-full h-full top-0 left-0 hover:scale-[1.05] transition-all"
                                    src="/graphIcon.png"
                                    alt={graph.name || 'Untitled Graph'}
                                    width={300}
                                    height={300}
                                />
                                <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
                                    <div className="flex flex-col h-full items-start justify-end p-6">
                                        <div className="text-lg text-left text-white">{graph.name || 'Untitled Graph'}</div>
                                        <div className="text-xs bg-white text-black rounded-lg w-fit px-2">
                                            {graph.graph_data.nodes.length} nodes, {graph.graph_data.edges.length} connections
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Modal
                                isOpen={selectedGraph?.id === graph.id}
                                onClose={() => setSelectedGraph(null)}
                            >
                                <div className="p-6">
                                    <div className="text-white">
                                        <h3 className="text-2xl font-bold mb-4">{graph.name || 'Untitled Graph'}</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-zinc-800 p-4 rounded-lg">
                                                <div className="text-sm text-zinc-400">Nodes</div>
                                                <div className="text-xl font-semibold">{graph.graph_data.nodes.length}</div>
                                            </div>
                                            <div className="bg-zinc-800 p-4 rounded-lg">
                                                <div className="text-sm text-zinc-400">Connections</div>
                                                <div className="text-xl font-semibold">{graph.graph_data.edges.length}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mt-4">
                                            <div className="bg-zinc-800 p-4 rounded-lg">
                                                <div className="text-sm text-zinc-400">Created On</div>
                                                <div className="text-sm font-medium">
                                                    {format(new Date(graph.created_at), 'PPP p')}
                                                </div>
                                            </div>
                                            <div className="bg-zinc-800 p-4 rounded-lg">
                                                <div className="text-sm text-zinc-400">Last Modified</div>
                                                <div className="text-sm font-medium">
                                                    {format(new Date(graph.updated_at), 'PPP p')}
                                                </div>
                                            </div>
                                            <div className="bg-zinc-800 p-4 rounded-lg">
                                                <div className="text-sm text-zinc-400">Created By</div>
                                                <div className="text-sm font-medium">{graph.owner_email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4 p-4 border-t border-zinc-800 mt-4">
                                        <button
                                            onClick={() => setSelectedGraph(null)}
                                            className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => selectedGraph && handleDeleteGraph(selectedGraph.id)}
                                            disabled={isDeleting}
                                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm w-28 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                        <button
                                            onClick={handleOpenGraph}
                                            className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    );
                })}
            </div>

            {graphs.length === 0 && (
                <div className="text-center text-zinc-400 py-8">
                    No graphs yet. Create your first graph!
                </div>
            )}
        </div>
    );
} 