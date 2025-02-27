import { solveLp } from "../../../src/model/leveling/LP";
import { Graph, Edge } from "../../../src/model/ds/Graph";

import { describe, it, expect, beforeEach } from "vitest";
import { createRandomLayeredGraph } from "../../../src/examples/GraphGenerator";

describe("SolveLp", () => {
  let graph = new Graph<Number, Edge<Number>>();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addVertex(4);
  graph.addEdge(new Edge(1, 2));
  graph.addEdge(new Edge(2, 3));
  graph.addEdge(new Edge(4, 3));
  const solution = solveLp(graph);
  it("should return correct levels for the vertices", () => {
    expect(solution.get(1)).toBe(0);
    expect(solution.get(2)).toBe(1);
    expect(solution.get(3)).toBe(2);
    expect(solution.get(4)).toBe(1);
  });
});

describe("SolveL2", () => {
  let graph = createRandomLayeredGraph([100, 100, 50], 0.4);
  solveLp(graph);
});
