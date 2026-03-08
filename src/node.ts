export type NodeIdType = string;

export class Node {
  id: NodeIdType;
  x: number | null;
  y: number | null;

  _name: string | ((obj: object) => string);
  _label: string | ((obj: object) => string);

  constructor(
    id: NodeIdType,
    name: string | ((obj: object) => string) = "",
    label: string | ((obj: object) => string) = "",
    x: number | null = null,
    y: number | null = null,
  ) {
    if(id === undefined) {
      console.error("Node id is undefined");
    }
    this.id = id;
    this._name = name;
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

  public get name(): string {
    if (typeof this._name === "function") {
      return this._name(this);
    }
    return this._name;
  }

  public set name(name: string | ((obj: object) => string)) {
    this._name = name;
  }

  public clone(): Node {
    return new Node(this.id, this._name, this._label, this.x, this.y);
  }
}
