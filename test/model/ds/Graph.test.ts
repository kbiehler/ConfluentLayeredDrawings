import { Graph, Edge } from "../../../src/model/ds/Graph";

import { describe, it, expect, beforeEach } from "vitest";

describe("Graph", () => {
  let graph;

  beforeEach(() => {
    graph = new Graph<Number, Edge<Number>>();
  });

  describe("Vertex", () => {
    it("should create a vertex", () => {
      
      graph.addVertex(1);
      expect(graph.getVertices()).toEqual([1]);
    });
  });
});
