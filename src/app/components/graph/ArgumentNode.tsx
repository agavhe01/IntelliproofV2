import React, { useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Node } from '../../types/graph';

interface ArgumentNodeProps extends NodeProps<Node> {
    onTextChange?: (text: string) => void;
    onBeliefChange?: (belief: number) => void;
    className?: string;
    style?: React.CSSProperties;
}

export function ArgumentNode(props: ArgumentNodeProps) {
    const {
        data,
        selected,
        className,
        style,
        onTextChange,
        onBeliefChange,
        // ignore all other props (including xPos, yPos, zIndex, etc.)
    } = props;
    useEffect(() => {
        console.log('ArgumentNode mounted:', data);
        return () => {
            console.log('ArgumentNode unmounted:', data);
        };
    }, [data]);

    const getNodeColor = (type: Node['type']) => {
        console.log('Getting color for node type:', type);
        switch (type) {
            case 'factual':
                return 'bg-blue-500';
            case 'policy':
                return 'bg-green-500';
            case 'value':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getRingColor = (type: Node['type']) => {
        switch (type) {
            case 'factual':
                return '#3b82f6'; // blue-500
            case 'policy':
                return '#22c55e'; // green-500
            case 'value':
                return '#a855f7'; // purple-500
            default:
                return '#6b7280'; // gray-500
        }
    };

    const getHighlightColor = (type: Node['type']) => {
        switch (type) {
            case 'factual':
                return '#60a5fa'; // blue-400
            case 'policy':
                return '#4ade80'; // green-400
            case 'value':
                return '#c084fc'; // purple-400
            default:
                return '#9ca3af'; // gray-400
        }
    };

    console.log('Rendering ArgumentNode:', { id: data.id, type: data.type, text: data.text });

    return (
        <>
            <style jsx>{`
                @keyframes pulse-ring {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                }
                .pulse-ring {
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    border-radius: 0.75rem;
                    border: 2px solid ${getRingColor(data.type)};
                    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
            <div
                className={`relative p-4 rounded-lg ${getNodeColor(data.type)} text-white min-w-[200px] transition-all duration-200 ${selected
                    ? `ring-2 ring-[${getHighlightColor(data.type)}] shadow-lg shadow-[${getHighlightColor(data.type)}]/20 scale-110`
                    : 'hover:ring-1 hover:ring-white/30'
                    } ${className ?? ''}`}
                style={{
                    ...(style ?? {}),
                    transform: selected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                    ...(selected ? {
                        '--tw-ring-color': getHighlightColor(data.type),
                        '--tw-shadow-color': getHighlightColor(data.type),
                    } : {})
                }}
            >
                {selected && <div className="pulse-ring" />}
                <Handle type="target" position={Position.Top} />
                <input
                    type="text"
                    value={data.text ?? ""}
                    onChange={e => onTextChange && onTextChange(e.target.value)}
                    className="font-medium mb-2 bg-transparent border-b border-white w-full outline-none text-white"
                    onPointerDown={e => e.stopPropagation()}
                />
                <div className="mb-2 text-xs uppercase tracking-wider opacity-80">{data.type}</div>
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={typeof data.belief === 'number' ? data.belief : 0}
                        onChange={e => onBeliefChange && onBeliefChange(parseFloat(e.target.value))}
                        className="w-24"
                        onPointerDown={e => e.stopPropagation()}
                    />
                    <span>{Math.round((typeof data.belief === 'number' ? data.belief : 0) * 100)}%</span>
                </div>
                <Handle type="source" position={Position.Bottom} />
            </div>
        </>
    );
} 