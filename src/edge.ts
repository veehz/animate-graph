import { Node, NodeIdType } from "./node";

export type EdgeIdType = string;

export class Edge {
  id: EdgeIdType;
  source: NodeIdType | Node;
  target: NodeIdType | Node;
  direction: "directed" | "undirected";
  type: string;

  constructor(
    source: NodeIdType | Node,
    target: NodeIdType | Node,
    direction: "directed" | "undirected" = "directed",
    type: string = "default",
    id: EdgeIdType | null = null,
  ) {
    this.source = source;
    this.target = target;
    this.direction = direction;
    this.type = type;
    this.id =
      id ||
      `${source instanceof Node ? source.id : source}-${target instanceof Node ? target.id : target}`;
  }
}
