import { Node, NodeIdType } from "./node";

export class Edge {
  source: NodeIdType | Node;
  target: NodeIdType | Node;
  direction: "directed" | "undirected";
  type: string;

  constructor(
    source: NodeIdType | Node,
    target: NodeIdType | Node,
    direction: "directed" | "undirected" = "directed",
    type: string = "default",
  ) {
    this.source = source;
    this.target = target;
    this.direction = direction;
    this.type = type;
  }
}
