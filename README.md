# Animate Graph

Animate Graph is a TypeScript library for creating and animating directed graphs.

### Installation

```bash
# npm:
npm install @veehz/animate-graph
# yarn:
yarn add @veehz/animate-graph
```

## Examples

```typescript
import { Graph, Node } from "@veehz/animate-graph";

const graph = new Graph("#graph-container");
const nodeA = new Node("n-a", "Node A", "A");
const nodeB = new Node("n-b", "Node B", "B");
graph.insertNode(nodeA);
graph.insertNode(nodeB);
```

See the [examples](examples) directory for full examples.
