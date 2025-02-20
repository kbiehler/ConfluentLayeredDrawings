import { Graph, Edge } from "../../../src/model/graphDs/Graph";

import { rlfColoring } from "../../../src/model/alg/Coloring";

import { describe, it, expect, beforeEach } from "vitest";

import { createWheelGraph } from "./ExampleGraphs";

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
    });

    it("n = 1000 => 4 colors", () => {
      const wheelGraph = createWheelGraph(1000);
      const coloring = rlfColoring(wheelGraph);
      expect(coloring.length).toBe(4);
    });
  });
});
