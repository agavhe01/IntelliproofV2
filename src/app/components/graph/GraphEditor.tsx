import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge as FlowEdge,
    Node as FlowNode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArgumentNode } from './ArgumentNode';
import { Node, Edge as ArgumentEdge, ArgumentGraph } from '../../types/graph';
import { supabase } from '../../utils/supabase';
import GraphManager from './GraphManager';
import dagre from 'dagre';

export default function GraphEditor() {
    console.log('GraphEditor component rendering');

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
    const [selectedNode, setSelectedNode] = useState<FlowNode<Node> | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<ArgumentEdge | null>(null);
    const [showManager, setShowManager] = useState(true);
    const [currentGraphId, setCurrentGraphId] = useState<string | null>(null);
    const [graphName, setGraphName] = useState<string>('Untitled Graph');

    useEffect(() => {
        console.log('GraphEditor mounted');
        return () => {
            console.log('GraphEditor unmounted');
        };
    }, []);

    const onConnect = useCallback(
        (params: Connection) => {
            console.log('Connecting nodes:', params);
            const newEdge: ArgumentEdge = {
                id: `e${edges.length + 1}`,
                source: params.source!,
                target: params.target!,
                weight: 0.5, // Default weight
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [edges, setEdges]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode<Node>) => {
        setSelectedNode(node);
        setSelectedEdge(null);
    }, []);

    const onEdgeClick = useCallback((event: React.MouseEvent, edge: FlowEdge) => {
        console.log('Edge clicked:', edge);
        setSelectedEdge(edge as ArgumentEdge);
        setSelectedNode(null);
    }, []);

    const addNode = async (type: Node['type']) => {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        let author = 'Unknown Author';

        if (user) {
            // Fetch the user's profile from the profiles table
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('email', user.email)
                .single();

            author = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email : user.email;
        }

        const newNode: Node = {
            id: `n${nodes.length + 1}`,
            type,
            text: `New ${type} node`,
            belief: 0.5,
            author,
            created_on: new Date().toISOString(),
        };

        const flowNode: FlowNode<Node> = {
            id: newNode.id,
            type: 'argument',
            position: { x: 100, y: 100 },
            data: newNode,
        };

        setNodes((nds) => [...nds, flowNode]);
    };

    const updateNodeText = (nodeId: string, newText: string) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            text: newText,
                        },
                    }
                    : node
            )
        );
        if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode({
                ...selectedNode,
                data: {
                    ...selectedNode.data,
                    text: newText,
                },
            });
        }
    };

    const updateNodeBelief = (nodeId: string, newBelief: number) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            belief: newBelief,
                        },
                    }
                    : node
            )
        );
        if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode({
                ...selectedNode,
                data: {
                    ...selectedNode.data,
                    belief: newBelief,
                },
            });
        }
    };

    const updateEdgeWeight = (edgeId: string, newWeight: number) => {
        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === edgeId
                    ? {
                        ...edge,
                        weight: newWeight,
                    }
                    : edge
            )
        );
    };

    const updateNodeType = (nodeId: string, newType: Node['type']) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            type: newType,
                        },
                    }
                    : node
            )
        );
        if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode({
                ...selectedNode,
                data: {
                    ...selectedNode.data,
                    type: newType,
                },
            });
        }
    };

    const saveGraph = async () => {
        console.log('Saving graph...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Ensure we're capturing the current state of nodes and edges
        const graphData: ArgumentGraph = {
            nodes: nodes.map(node => ({
                id: node.id,
                type: node.data.type,
                text: node.data.text,
                belief: node.data.belief,
                author: node.data.author,
                created_on: node.data.created_on
            })),
            edges: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                weight: (edge as any).weight || 0.5
            }))
        };

        console.log('Saving graph data:', graphData); // Debug log

        try {
            if (currentGraphId) {
                // Update existing graph
                const { error } = await supabase
                    .from('graphs')
                    .update({
                        graph_data: graphData,
                        name: graphName,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentGraphId)
                    .eq('owner_email', user.email);

                if (error) {
                    console.error('Error updating graph:', error);
                    alert('Failed to update graph. Please try again.');
                    return;
                }
                console.log('Graph updated successfully');
            } else {
                // Create new graph
                const { error, data } = await supabase
                    .from('graphs')
                    .insert({
                        owner_email: user.email,
                        graph_data: graphData,
                        name: graphName,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('Error creating graph:', error);
                    alert('Failed to create graph. Please try again.');
                    return;
                }

                if (data) {
                    setCurrentGraphId(data.id);
                }
                console.log('New graph created successfully');
            }

            setShowManager(true);
        } catch (error) {
            console.error('Error in saveGraph:', error);
            alert('An error occurred while saving the graph.');
        }
    };

    const handleSelectGraph = (graph: ArgumentGraph) => {
        console.log('Selecting graph:', graph);
        const flowNodes: FlowNode<Node>[] = graph.nodes.map((node, index) => ({
            id: node.id,
            type: 'argument',
            position: { x: 100 + index * 200, y: 100 },
            data: node,
        }));

        const flowEdges = graph.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
        setGraphName(graph.name || 'Untitled Graph');
        setShowManager(false);
    };

    const handleNewGraph = () => {
        console.log('Creating new graph');
        setNodes([]);
        setEdges([]);
        setCurrentGraphId(null);
        setGraphName('Untitled Graph');
        setShowManager(false);
    };

    console.log('Current state:', { showManager, nodesCount: nodes.length, edgesCount: edges.length });

    const coloredEdges = edges.map(edge => {
        const argEdge = edge as ArgumentEdge;
        let color = 'gray';
        if (argEdge.weight > 0) color = 'blue';
        else if (argEdge.weight < 0) color = 'red';

        const isSelected = selectedEdge?.id === edge.id;
        return {
            ...edge,
            style: {
                stroke: color,
                strokeWidth: isSelected ? 6 : 3,
                transition: 'all 0.2s ease-in-out',
                filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none'
            },
        };
    });

    const nodeTypes = useMemo(() => ({
        argument: (nodeProps: any) => (
            <ArgumentNode
                {...nodeProps}
                data={nodeProps.data}
                onTextChange={(text: string) => {
                    setNodes((nds: any[]) =>
                        nds.map((n: any) =>
                            n.id === nodeProps.id
                                ? { ...n, data: { ...n.data, text } }
                                : n
                        )
                    );
                }}
                onBeliefChange={(belief: number) => {
                    setNodes((nds: any[]) =>
                        nds.map((n: any) =>
                            n.id === nodeProps.id
                                ? { ...n, data: { ...n.data, belief } }
                                : n
                        )
                    );
                }}
            />
        ),
    }), [setNodes]);

    const liveSelectedEdge = selectedEdge ? edges.find(e => e.id === selectedEdge.id) as ArgumentEdge : null;

    // DAGRE LAYOUT FUNCTION
    const applyAutoLayout = useCallback(() => {
        const g = new dagre.graphlib.Graph();
        g.setDefaultEdgeLabel(() => ({}));
        g.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 100 });

        nodes.forEach((node) => {
            g.setNode(node.id, { width: 200, height: 100 });
        });
        edges.forEach((edge) => {
            g.setEdge(edge.source, edge.target);
        });
        dagre.layout(g);
        const newNodes = nodes.map((node) => {
            const dagreNode = g.node(node.id);
            return {
                ...node,
                position: dagreNode ? { x: dagreNode.x - 100, y: dagreNode.y - 50 } : node.position,
            };
        });
        setNodes(newNodes);
    }, [nodes, edges, setNodes]);

    // FORCE-DIRECTED LAYOUT FUNCTION (simple, not physics-accurate)
    const applyForceLayout = useCallback(() => {
        const width = 800;
        const height = 400;
        const centerX = width / 2;
        const centerY = height / 2;
        const k = 200; // repulsion constant
        const iterations = 100;
        let nodePositions = nodes.map((n, i) => ({ ...n, fx: Math.random() * width, fy: Math.random() * height }));
        for (let iter = 0; iter < iterations; iter++) {
            // Repulsion
            for (let i = 0; i < nodePositions.length; i++) {
                for (let j = 0; j < nodePositions.length; j++) {
                    if (i === j) continue;
                    let dx = nodePositions[i].fx - nodePositions[j].fx;
                    let dy = nodePositions[i].fy - nodePositions[j].fy;
                    let dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
                    let repulse = k * k / dist;
                    nodePositions[i].fx += (dx / dist) * repulse * 0.0001;
                    nodePositions[i].fy += (dy / dist) * repulse * 0.0001;
                }
            }
            // Attraction (edges)
            edges.forEach(edge => {
                const sourceIdx = nodePositions.findIndex(n => n.id === edge.source);
                const targetIdx = nodePositions.findIndex(n => n.id === edge.target);
                if (sourceIdx === -1 || targetIdx === -1) return;
                let dx = nodePositions[targetIdx].fx - nodePositions[sourceIdx].fx;
                let dy = nodePositions[targetIdx].fy - nodePositions[sourceIdx].fy;
                let dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
                let attract = (dist * dist) / k;
                nodePositions[sourceIdx].fx += (dx / dist) * attract * 0.0001;
                nodePositions[sourceIdx].fy += (dy / dist) * attract * 0.0001;
                nodePositions[targetIdx].fx -= (dx / dist) * attract * 0.0001;
                nodePositions[targetIdx].fy -= (dy / dist) * attract * 0.0001;
            });
        }
        // Center and scale
        nodePositions = nodePositions.map(n => ({
            ...n,
            position: {
                x: centerX + (n.fx - centerX) * 0.7,
                y: centerY + (n.fy - centerY) * 0.7,
            }
        }));
        setNodes(nodePositions.map(({ fx, fy, ...n }) => n));
    }, [nodes, edges, setNodes]);

    // CIRCULAR LAYOUT FUNCTION
    const applyCircularLayout = useCallback(() => {
        const radius = 250;
        const centerX = 500;
        const centerY = 300;
        const angleStep = (2 * Math.PI) / nodes.length;
        const newNodes = nodes.map((node, i) => ({
            ...node,
            position: {
                x: centerX + radius * Math.cos(i * angleStep),
                y: centerY + radius * Math.sin(i * angleStep),
            }
        }));
        setNodes(newNodes);
    }, [nodes, setNodes]);

    return (
        <div className="w-full h-full flex">
            <div className="flex-1 relative">
                {showManager ? (
                    <GraphManager
                        onSelectGraph={handleSelectGraph}
                        onNewGraph={handleNewGraph}
                    />
                ) : (
                    <>
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button
                                onClick={() => setShowManager(true)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Back to Graphs
                            </button>
                            <button
                                onClick={applyAutoLayout}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Auto Layout
                            </button>
                            <button
                                onClick={applyForceLayout}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Force Layout
                            </button>
                            <button
                                onClick={applyCircularLayout}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Circular Layout
                            </button>
                            <button
                                onClick={saveGraph}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Save Graph
                            </button>
                        </div>
                        <ReactFlow
                            nodes={nodes}
                            edges={coloredEdges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onEdgeClick={onEdgeClick}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background />
                            <Controls />
                            <MiniMap />
                        </ReactFlow>
                    </>
                )}
            </div>
            {!showManager && (
                <div className="w-80 bg-zinc-900 p-4 border-l border-zinc-800 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Graph Name</h2>
                            <input
                                type="text"
                                value={graphName}
                                onChange={(e) => setGraphName(e.target.value)}
                                className="w-full bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter graph name"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Add Node</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={async () => await addNode('factual')}
                                    className="w-full bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 text-sm"
                                >
                                    Add Factual Node
                                </button>
                                <button
                                    onClick={async () => await addNode('policy')}
                                    className="w-full bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 text-sm"
                                >
                                    Add Policy Node
                                </button>
                                <button
                                    onClick={async () => await addNode('value')}
                                    className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 text-sm"
                                >
                                    Add Value Node
                                </button>
                            </div>
                        </div>

                        {selectedNode && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Node Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Text
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.text ?? ""}
                                            onChange={(e) => updateNodeText(selectedNode.id, e.target.value)}
                                            className="w-full bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.type ?? ""}
                                            readOnly
                                            className="w-full bg-zinc-800 text-gray-400 px-3 py-2 rounded-lg border border-zinc-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Belief
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={typeof selectedNode.data.belief === 'number' ? selectedNode.data.belief : 0}
                                            onChange={(e) => updateNodeBelief(selectedNode.id, parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                        <div className="text-sm text-gray-400 text-right">
                                            {Math.round((typeof selectedNode.data.belief === 'number' ? selectedNode.data.belief : 0) * 100)}%
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">ID</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.id ?? ""}
                                            readOnly
                                            className="w-full bg-zinc-800 text-gray-400 px-3 py-2 rounded-lg border border-zinc-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.author ?? ""}
                                            readOnly
                                            className="w-full bg-zinc-800 text-gray-400 px-3 py-2 rounded-lg border border-zinc-700"
                                        />
                                    </div>
                                    <button
                                        className="w-full bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 mt-4 text-sm"
                                        onClick={() => {
                                            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
                                            setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
                                            setSelectedNode(null);
                                        }}
                                    >
                                        Delete Selected Node
                                    </button>
                                </div>
                            </div>
                        )}

                        {liveSelectedEdge && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Edge Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">ID</label>
                                        <input
                                            type="text"
                                            value={liveSelectedEdge.id}
                                            readOnly
                                            className="w-full bg-zinc-800 text-gray-400 px-3 py-2 rounded-lg border border-zinc-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Source Node</label>
                                        <input
                                            type="text"
                                            value={liveSelectedEdge.source}
                                            readOnly
                                            className="w-full bg-zinc-800 text-gray-400 px-3 py-2 rounded-lg border border-zinc-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Target Node</label>
                                        <input
                                            type="text"
                                            value={liveSelectedEdge.target}
                                            readOnly
                                            className="w-full bg-zinc-800 text-gray-400 px-3 py-2 rounded-lg border border-zinc-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Weight</label>
                                        <input
                                            type="range"
                                            min="-1"
                                            max="1"
                                            step="0.1"
                                            value={liveSelectedEdge.weight}
                                            onChange={(e) => updateEdgeWeight(liveSelectedEdge.id, parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm text-gray-400">{Math.round(liveSelectedEdge.weight * 100)}%</span>
                                            <span className="ml-2 flex items-center gap-1">
                                                <span className="text-sm">Color:</span>
                                                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: liveSelectedEdge.weight > 0 ? 'blue' : liveSelectedEdge.weight < 0 ? 'red' : 'gray' }}></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 