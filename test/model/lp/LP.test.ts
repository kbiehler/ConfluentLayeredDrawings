import { solveLp } from "../../../src/model/input/LP";
import { Graph, Edge } from "../../../src/model/ds/Graph";

import { describe, it, expect, beforeEach } from "vitest";
import { createRandomLayeredGraph } from "../../../src/examples/GraphGenerator";

// describe("SolveLp", () => {
//   let graph = new Graph<Number, Edge<Number>>();
//   graph.addVertex(1);
//   graph.addVertex(2);
//   graph.addVertex(3);
//   graph.addVertex(4);
//   graph.addEdge(new Edge(1, 2));
//   graph.addEdge(new Edge(2, 3));
//   graph.addEdge(new Edge(4, 3));
//   solveLp(graph);
// });

describe("SolveL2", () => {
  let graph = createRandomLayeredGraph([200, 200, 50], 0.4);
  solveLp(graph);
});
