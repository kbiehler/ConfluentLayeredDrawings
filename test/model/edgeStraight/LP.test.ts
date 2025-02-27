import { solveLp } from "../../../src/model/positioning/PositionLP";
import { Edge, LayerGraph } from "../../../src/model/ds/";

import { describe, it, expect, beforeEach } from "vitest";
import {} from "../../../src/model/ds/LayerGraph";

describe("SolveLp", () => {
  /*
  layer3: d,    e
  layer2: b, x, c
  layer1:    a
  example for graph with edges {ab, ac, bd, ce}
  */

  let graph = new LayerGraph<string, Edge<string>>();
  graph.addVertexToLayer("a", 0);
  graph.addVertexToLayer("b", 1);
  graph.addVertexToLayer("x", 1);
  graph.addVertexToLayer("c", 1);
  graph.addVertexToLayer("d", 2);
  graph.addVertexToLayer("e", 2);
  graph.addEdge(new Edge("a", "b"));
  graph.addEdge(new Edge("a", "c"));
  graph.addEdge(new Edge("b", "d"));
  graph.addEdge(new Edge("c", "e"));

  const layers = [["a"], ["b", "x", "c"], ["d", "e"]];
  const yPos = solveLp(graph, layers);

  it("should return correct yPositions for the vertices", () => {
    expect(yPos.get("a")).toBe(0);
    expect(yPos.get("b")).toBe(0);
    expect(yPos.get("c")).toBe(2);
    expect(yPos.get("x")).toBe(1);
    expect(yPos.get("d")).toBe(0);
    expect(yPos.get("e")).toBe(2);
  });
});

// describe("SolveL2", () => {
//   let graph = createRandomLayeredGraph([200, 200, 50], 0.4);
//   solveLp(graph);
// });
