import { describe, it, expect, beforeEach } from "vitest";
import { BarycenterOrderer } from "../../../src/model/layout/BarycenterOrderer";
import { LayerGraph, Graph, Edge } from "../../../src/model/ds";

describe("BarycenterOrderer", () => {
  it("should perform barycenter ordering on a simple layered graph", () => {
    const orderer = new BarycenterOrderer(1, false);

    const graph = new LayerGraph<number, any>();
    graph.addVertexToLayer(0, 0);
    graph.addVertexToLayer(1, 0);
    graph.addVertexToLayer(2, 1);
    graph.addVertexToLayer(3, 1);
    graph.addEdge(new Edge(0, 3));
    graph.addEdge(new Edge(1, 2));

    const layout = orderer.barycenterOrdering(graph);
    expect(layout).toEqual([
      [0, 1],
      [3, 2],
    ]);
  });
});
