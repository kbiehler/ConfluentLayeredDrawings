import { findComponents } from "../../../src/model/alg/Components";
import { describe, it, expect } from "vitest";
import { Graph, Edge } from "../../../src/model/ds";

describe("findComponents", () => {
  it("should find no components in an empty graph", () => {
    const graph = new Graph<number, any>();
    const components = findComponents(graph);
    expect(components).toEqual([]);
  });

  it("should find one component in a graph with one node", () => {
    const graph = new Graph<number, any>();
    graph.addVertex(1);
    const components = findComponents(graph);
    expect(components).toEqual([new Set([1])]);
  });

  it("should find one component in a fully connected graph", () => {
    const graph = new Graph<number, any>();
    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addEdge(new Edge(1, 2));
    graph.addEdge(new Edge(2, 3));
    const components = findComponents(graph);
    expect(components).toEqual([new Set([1, 2, 3])]);
  });

  it("should find two components in a graph with two disconnected subgraphs", () => {
    const graph = new Graph<number, any>();
    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addVertex(4);
    graph.addEdge(new Edge(1, 2));
    graph.addEdge(new Edge(3, 4));
    const components = findComponents(graph);
    expect(components).toEqual([new Set([1, 2]), new Set([3, 4])]);
  });

  it("should find multiple components in a graph with multiple disconnected subgraphs", () => {
    const graph = new Graph<number, any>();
    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addVertex(4);
    graph.addVertex(5);
    graph.addEdge(new Edge(1, 2));
    graph.addEdge(new Edge(3, 4));
    const components = findComponents(graph);
    expect(components).toEqual([new Set([1, 2]), new Set([3, 4]), new Set([5])]);
  });
});
