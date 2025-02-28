import { LayoutVertex } from "../layout/Vertex";
import { VertexId } from "../types";
import { Edge, Graph } from "../ds";

/**
 * new graph containing only selected vertices and their neighbors
 * @param g
 * @param selection
 * @returns
 */
export function buildNbrGraph(g: Graph<LayoutVertex, Edge<LayoutVertex>>, selection: Set<VertexId>): Graph<LayoutVertex> {
  const idToVertex = new Map<VertexId, LayoutVertex>();
  g.getVertices().forEach((v) => idToVertex.set(v.getId(), v));

  const newGraph = new Graph<LayoutVertex>();
  const seen = new Set<LayoutVertex>();

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
export function buildImplGraph(g: Graph<LayoutVertex, Edge<LayoutVertex>>, selection: Set<VertexId>): Graph<LayoutVertex> {
  const idToVertex = new Map<VertexId, LayoutVertex>();
  g.getVertices().forEach((v) => idToVertex.set(v.getId(), v));

  const newGraph = new Graph<LayoutVertex>();
  const q = new Set<LayoutVertex>();
  selection.forEach((v) => {
    q.add(idToVertex.get(v)!);
  });

  const seen = new Set<LayoutVertex>();
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

function addIfNew(seen: Set<LayoutVertex>, newGraph: Graph<LayoutVertex, Edge<LayoutVertex>>, v: LayoutVertex) {
  if (!seen.has(v)) {
    newGraph.addVertex(v);
    seen.add(v);
  }
}
