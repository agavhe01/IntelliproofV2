export interface Node {
    id: string;
    type: 'factual' | 'policy' | 'value';
    text: string;
    belief: number | null;
    author: string;
    created_on: string;
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
} 