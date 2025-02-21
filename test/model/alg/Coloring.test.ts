import { rlfColoring } from "../../../src/model/alg/Coloring";

import { describe, it, expect, beforeEach } from "vitest";

import { createWheelGraph, createRandomGraph, createRandomBiGraph } from "./ExampleGraphs";

describe("RLF Coloring", () => {
  describe("Wheel Graph should be colored optimally", () => {
    it("n = 6 => 4 colors", () => {
      const wheelGraph = createWheelGraph(6);
      const coloring = rlfColoring(wheelGraph);
      expect(coloring.length).toBe(4);
    });

    it("n = 7 => 3 colors", () => {
      const wheelGraph = createWheelGraph(7);
      const coloring = rlfColoring(wheelGraph);
      expect(coloring.length).toBe(3);
      expect(wheelGraph.getVertices().length).toBe(7);
    });

    it("n = 1000 => 4 colors", () => {
      const wheelGraph = createWheelGraph(1000);
      const coloring = rlfColoring(wheelGraph);
      expect(coloring.length).toBe(4);
    });
  });

  describe("Random Graph should be valid colored", () => {
    const graph = createRandomGraph(250, 0.4);
    const coloring = rlfColoring(graph);
    console.log(coloring.length);
    it("All vertices should be colored", () => {
      expect(coloring.reduce((acc, set) => acc + set.size, 0)).toBe(250);
    });

    it("No two adjacent vertices should have the same color", () => {
      graph.getEdges().forEach((edge) => {
        const vColor = coloring.findIndex((set) => set.has(edge.source));
        const uColor = coloring.findIndex((set) => set.has(edge.target));
        expect(uColor).not.toBe(vColor);
      });
    });
  });

  describe("Bipartite Graph should be colored optimally", () => {
    it("2 colors", () => {
      const biGraph = createRandomBiGraph(18, 4, 0.4);
      const graph = biGraph.copy();
      const coloring = rlfColoring(graph);
      expect(coloring.length).toBe(2);
    });

    it("2 colors", () => {
      const biGraph = createRandomBiGraph(22, 28, 0.4);
      const graph = biGraph.copy();
      const coloring = rlfColoring(graph);
      expect(coloring.length).toBe(2);
    });
  });
});
