import * as d3 from "d3";
import { Node } from "./node";
import { Edge } from "./edge";
import "./style.css";
import { GraphStyle, parseGraphStyle } from "./constants";

export class Graph {
  public selector: string;
  public width: number;
  public height: number;
  public nodes: Node[];
  public edges: Edge[];

  private container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private linkGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private nodeGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  public style: GraphStyle;

  /**
   * Creates a new Graph instance.
   * @param selector - The CSS selector for the container element.
   * @param options - Optional configuration for the graph.
   * @param options.width - The width of the graph.
   * @param options.height - The height of the graph.
   */
  constructor(
    selector: string,
    options: { width?: number; height?: number } = {},
  ) {
    this.selector = selector;
    this.width = options.width || 800;
    this.height = options.height || 600;

    this.nodes = [];
    this.edges = [];

    this.style = parseGraphStyle();

    this.container = d3.select(this.selector);
    this.container.text("");
    this.container.selectAll("*").remove();

    this.svg = this.container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      ])
      .style("max-width", "100%")
      .style("height", "auto");

    const refX = this.style.arrowLength;

    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", refX)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    this.g = this.svg.append("g");

    this.linkGroup = this.g.append("g").attr("class", "links");
    this.nodeGroup = this.g.append("g").attr("class", "nodes");

    this.update();
  }

  /**
   * Updates the graph visualization based on the current nodes and edges.
   */
  public update() {
    const links = this.linkGroup
      .selectAll<SVGLineElement, Edge>(".g_edge")
      .data(this.edges, (d: Edge) => {
        const sId = (d.source as Node).id || (d.source as string);
        const tId = (d.target as Node).id || (d.target as string);
        return sId + "-" + tId;
      });

    links.exit().remove();

    const linkEnter = links
      .enter()
      .append("line")
      .attr("class", "g_edge")
      .classed("directed", (d) => d.direction === "directed");

    const linkMerge = linkEnter.merge(links);

    linkMerge.each((d, i, nodes) => {
      const source = this.getNode(d.source);
      const target = this.getNode(d.target);
      if (source && target) {
        const coords = this.calculateEdgePoints(source, target);

        d3.select(nodes[i])
          .attr("x1", coords.x1)
          .attr("y1", coords.y1)
          .attr("x2", coords.x2)
          .attr("y2", coords.y2);
      }
    });

    const nodes = this.nodeGroup
      .selectAll<SVGGElement, Node>(".g_node")
      .data(this.nodes, (d: Node) => d.id);

    nodes.exit().remove();

    const nodeEnter = nodes.enter().append("g").attr("class", "g_node");

    nodeEnter.append("circle").attr("r", this.style.nodeRadius);

    nodeEnter
      .append("text")
      .text((d) => d.label)
      .attr("dy", 4);

    nodeEnter.append("title").text((d) => d.name);

    const nodeMerge = nodeEnter.merge(nodes);

    nodeMerge.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  /**
   * Inserts a new node into the graph.
   * @param node - The node to insert.
   */
  public insertNode(node: Node) {
    if (this.nodes.some((n) => n.id === node.id)) {
      console.warn(`Node with id ${node.id} already exists.`);
      return;
    }

    if (node.x === null || node.y === null) {
      const pos = this.findFreePosition(0, 0);
      node.x = pos.x;
      node.y = pos.y;
    }

    this.nodes.push(node);
    this.update();
  }

  /**
   * Inserts a new node after one or more existing nodes.
   * @param node - The node to insert.
   * @param afterNodes - The node or array of nodes after which to insert the new node.
   */
  public insertNodeAfter(
    node: Node,
    afterNodes: string | Node | (string | Node)[],
  ) {
    const sources = Array.isArray(afterNodes) ? afterNodes : [afterNodes];

    let maxX = -Infinity;
    let sumY = 0;
    let count = 0;

    sources.forEach((source) => {
      const sNode = this.getNode(source);
      if (sNode && sNode.x !== null && sNode.y !== null) {
        if (sNode.x > maxX) maxX = sNode.x;
        sumY += sNode.y;
        count++;
      }
    });

    const LEVEL_WIDTH = this.style.levelWidth;

    if (count > 0) {
      const startX = maxX + LEVEL_WIDTH;
      const startY = sumY / count;

      if (node.x === null || node.y === null) {
        const pos = this.findFreePosition(startX, startY);
        node.x = pos.x;
        node.y = pos.y;
      }
    } else {
      if (node.x === null || node.y === null) {
        const pos = this.findFreePosition(0, 0);
        node.x = pos.x;
        node.y = pos.y;
      }
    }

    this.insertNode(node);

    sources.forEach((source) => {
      this.insertEdge(source, node);
    });
  }

  /**
   * Inserts a new edge between two nodes.
   * @param source - The source node or its ID.
   * @param target - The target node or its ID.
   * @param options - Optional configuration for the edge.
   * @param options.direction - The direction of the edg  e.
   * @param options.type - The type of the edge.
   */
  public insertEdge(
    source: string | Node,
    target: string | Node,
    options: { direction?: "directed" | "undirected"; type?: string } = {},
  ) {
    const edge = new Edge(source, target, options.direction, options.type);
    this.edges.push(edge);
    this.update();
  }

  /**
   * Clones the graph.
   * @returns A new Graph instance with the same nodes and edges.
   */
  public clone(): Graph {
    const graph = new Graph(this.selector, {
      width: this.width,
      height: this.height,
    });
    graph.nodes = [...this.nodes];
    graph.edges = [...this.edges];
    return graph;
  }

  /**
   * Activates the graph, appending it to the container.
   */
  public activate() {
    this.container.text("");
    this.container.selectAll("*").remove();
    (this.container.node() as Element)?.appendChild(
      this.svg.node() as unknown as globalThis.Node,
    );
    this.update();
  }

  /**
   * Deactivates the graph, removing it from the container.
   */
  public deactivate() {
    this.svg.remove();
  }

  private calculateEdgePoints(source: Node, target: Node) {
    const radius = this.style.nodeRadius;
    const arrowOffset = this.style.arrowOffset;

    const sx = source.x ?? 0;
    const sy = source.y ?? 0;
    const tx = target.x ?? 0;
    const ty = target.y ?? 0;

    const dx = tx - sx;
    const dy = ty - sy;
    const angle = Math.atan2(dy, dx);

    const startOffset = radius;
    const x1 = sx + Math.cos(angle) * startOffset;
    const y1 = sy + Math.sin(angle) * startOffset;

    const endOffset = radius + arrowOffset;
    const x2 = tx - Math.cos(angle) * endOffset;
    const y2 = ty - Math.sin(angle) * endOffset;

    return { x1, y1, x2, y2 };
  }

  private getNode(idOrNode: string | Node): Node | undefined {
    if ((idOrNode as any).id !== undefined) return idOrNode as Node;
    return this.nodes.find((n) => n.id === idOrNode);
  }

  private findFreePosition(startX: number, startY: number) {
    const NODE_RADIUS = this.style.nodeRadius;
    const NODE_GAP = this.style.nodeGap;
    const VERTICAL_SPACING = NODE_RADIUS * 2 + NODE_GAP;

    let x = startX;
    let y = startY;

    let collision = true;
    while (collision) {
      collision = false;
      for (const node of this.nodes) {
        if (node.x !== null && node.y !== null) {
          const dx = node.x - x;
          const dy = node.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < VERTICAL_SPACING - 1) {
            collision = true;
            break;
          }
        }
      }

      if (collision) {
        y += VERTICAL_SPACING;
      }
    }
    return { x, y };
  }
}
