import { Vertex } from "../ds/Vertex";
import { VertexId } from "../types";
import { Edge, Graph } from "../ds";

/**
 * new graph containing only selected vertices and their neighbors
 * @param g
 * @param selection
 * @returns
 */
export function buildNbrGraph(g: Graph, selection: Set<VertexId>): Graph {
  const idToVertex = new Map<VertexId, Vertex>();
  g.getVertices().forEach((v) => idToVertex.set(v.getId(), v));

  const newGraph = new Graph();
  const seen = new Set<Vertex>();

  selection.forEach((v) => {
    addIfNew(seen, newGraph, idToVertex.get(v)!);
    g.getIncident(idToVertex.get(v)!).forEach((e) => {
      addIfNew(seen, newGraph, e.source);
      addIfNew(seen, newGraph, e.target);
      newGraph.addEdge(e);
    });
  });
  return newGraph;
}

/**
 * new graph containing selected vertices + all edges and vertices in g that lie on a directed path starting at a selected vertex
 * @param g
 * @param selection
 * @returns
 */
export function buildImplGraph(g: Graph, selection: Set<VertexId>): Graph {
  const idToVertex = new Map<VertexId, Vertex>();
  g.getVertices().forEach((v) => idToVertex.set(v.getId(), v));

  const newGraph = new Graph();
  const q = new Set<Vertex>();
  selection.forEach((v) => {
    q.add(idToVertex.get(v)!);
  });

  const seen = new Set<Vertex>();
  while (q.size > 0) {
    const v = q.values().next().value!;
    q.delete(v);
    addIfNew(seen, newGraph, v);
    g.getIncidentOut(v).forEach((e) => {
      addIfNew(seen, newGraph, e.target);
      q.add(e.target);
      newGraph.addEdge(e);
    });
  }
  return newGraph;
}

function addIfNew(seen: Set<Vertex>, newGraph: Graph, v: Vertex) {
  if (!seen.has(v)) {
    newGraph.addVertex(v);
    seen.add(v);
  }
}
