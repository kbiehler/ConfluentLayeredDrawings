import { describe, it, expect } from "vitest";
import { Graph, Edge, BipartiteGraph } from "../../../src/model/ds";
import { biCliqueCover } from "../../../src/model/alg/BiCliqueCover";

describe("biCliqueCover", () => {
  it("should return an empty array for an empty graph", () => {
    const G = new BipartiteGraph<number, Edge<number>>();
    const result = biCliqueCover(G);
    expect(result).toEqual([]);
  });

  it("should return a single biclique for a simple bipartite graph", () => {
    const G = new BipartiteGraph<number, Edge<number>>();
    G.addVertexA(1);
    G.addVertexA(2);
    G.addVertexB(3);
    G.addVertexB(4);
    const edge1 = new Edge(1, 3);
    const edge2 = new Edge(1, 4);
    const edge3 = new Edge(2, 3);
    const edge4 = new Edge(2, 4);
    G.addEdge(edge1);
    G.addEdge(edge2);
    G.addEdge(edge3);
    G.addEdge(edge4);

    const result = biCliqueCover(G);
    expect(result.length).toBe(1);
    expect(result[0].has(1)).toBe(true);
    expect(result[0].has(2)).toBe(true);
    expect(result[0].has(3)).toBe(true);
    expect(result[0].has(4)).toBe(true);
  });

  it("should return two bicliques", () => {
    const G = new BipartiteGraph<number, Edge<number>>();
    G.addVertexA(1);
    G.addVertexA(2);
    G.addVertexB(3);
    G.addVertexB(4);
    G.addVertexB(5);
    const edge1 = new Edge(1, 3);
    const edge2 = new Edge(1, 5);
    const edge3 = new Edge(2, 3);
    const edge4 = new Edge(2, 4);
    G.addEdge(edge1);
    G.addEdge(edge2);
    G.addEdge(edge3);
    G.addEdge(edge4);

    const result = biCliqueCover(G);
    expect(result.length).toBe(2);
  });
});
