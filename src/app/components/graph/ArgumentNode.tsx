import React, { useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Node } from '../../types/graph';

export function ArgumentNode(props: NodeProps<Node> & {
    onTextChange?: (text: string) => void;
    onBeliefChange?: (belief: number) => void;
}) {
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

    console.log('Rendering ArgumentNode:', { id: data.id, type: data.type, text: data.text });

    return (
        <div
            className={`p-4 rounded-lg ${getNodeColor(data.type)} text-white min-w-[200px]${selected ? ' ring-2 ring-yellow-400' : ''} ${((props as any).className ?? '')}`}
            style={(props as any).style ?? {}}
        >
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
    );
} 