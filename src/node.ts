export type NodeIdType = string;

export class Node {
  id: NodeIdType;
  name: string | null;
  x: number | null;
  y: number | null;

  _label: string | ((obj: object) => string);

  constructor(
    id: NodeIdType,
    name: string | null = null,
    label: string | ((obj: object) => string) = "",
    x: number | null = null,
    y: number | null = null,
  ) {
    this.id = id;
    this.name = name;
    this._label = label;
    // Static layout properties, assigned by Graph if null
    this.x = x;
    this.y = y;
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

  public clone(): Node {
    return new Node(this.id, this.name, this._label, this.x, this.y);
  }
}
