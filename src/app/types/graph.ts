export interface Node {
    id: string;
    type: 'factual' | 'policy' | 'value';
    text: string;
    belief: number | null;
    author: string;
    created_on: string;
    position?: { x: number; y: number };
}

export interface Edge {
    id: string;
    source: string;
    target: string;
    weight: number;
}

export interface ArgumentGraph {
    nodes: Node[];
    edges: Edge[];
    name?: string;
} 