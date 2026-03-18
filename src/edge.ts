import { Node, NodeIdType } from "./node";

export type EdgeIdType = string;

export class Edge {
  id: EdgeIdType;
  source: NodeIdType | Node;
  target: NodeIdType | Node;
  direction: "directed" | "undirected";
  type: string;

  _label: string | ((obj: object) => string);
  showLabelOnHover: boolean;

  constructor(
    source: NodeIdType | Node,
    target: NodeIdType | Node,
    direction: "directed" | "undirected" = "directed",
    type: string = "default",
    label: string | ((obj: object) => string) = "",
    id: EdgeIdType | null = null,
    showLabelOnHover: boolean = false,
  ) {
    this.source = source;
    this.target = target;
    this.direction = direction;
    this.type = type;
    this._label = label;
    this.id = id || Edge.defaultEdgeId(source, target);
    this.showLabelOnHover = showLabelOnHover;
  }

  static defaultEdgeId(source: NodeIdType | Node, target: NodeIdType | Node): EdgeIdType {
    return `${source instanceof Node ? source.id : source}-${target instanceof Node ? target.id : target}`;
  }

  public get label(): string {
    if (typeof this._label === "function") {
      return this._label(this);
    }
    return this._label;
  }

  public set label(label: string | ((obj: object) => string)) {
    this._label = label;
  }

  public clone(): Edge {
    return new Edge(this.source, this.target, this.direction, this.type, this._label, this.id, this.showLabelOnHover);
  }
}
