export type NodeIdType = string;

export class Node {
  id: NodeIdType;
  name: string;
  label: string;
  x: number | null;
  y: number | null;

  constructor(
    id: NodeIdType,
    name: string,
    label: string,
    x: number | null = null,
    y: number | null = null,
  ) {
    this.id = id;
    this.name = name || id;
    this.label = label || name || id;
    // Static layout properties, assigned by Graph if null
    this.x = x;
    this.y = y;
  }
}
