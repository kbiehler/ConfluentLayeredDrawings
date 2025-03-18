import { solveBundelingLp } from "../../../src/model/layout/edges/plan/BundelingILP";
import { Graph, Edge } from "../../../src/model/ds/Graph";

import { describe, it, expect } from "vitest";
import { createRandomLayeredGraph } from "../../../src/examples/GraphGenerator";

describe("SolveLp", () => {
  let graph = new Graph<String>();
  graph.addVertex("a");
  graph.addVertex("b");
  graph.addVertex("c");
  graph.addEdge(new Edge("a", "b"));
  graph.addEdge(new Edge("a", "c"));
  const solution = solveBundelingLp(graph);
  console.log(solution);
  it("should return correct levels for the vertices", () => {
    expect(solution.get("a") != solution.get("b")).toBe(true);
    expect(solution.get("b") == solution.get("c")).toBe(true);
  });
});


