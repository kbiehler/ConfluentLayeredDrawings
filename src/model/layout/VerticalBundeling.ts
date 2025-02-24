import { Edge, Graph, BipartiteGraph } from "@/model/ds";
import { Point2d } from "../types/Point";

type Interval = [number, number];

export function createConflictGraph<V, E extends Edge<V>>(layerGraph: BipartiteGraph<V, E>, vertexPositions: Map<V, Point2d>): Graph<E, Edge<E>> {
  const conflictGraph = new Graph<E, Edge<E>>(); //conflict graph between edges of the input graph
  const edgeToInterval = new Map<E, Interval>();

  const edges = layerGraph.getEdges();

  edges.forEach((edge) => {
    const sourceY = vertexPositions.get(edge.source)!.y;
    const targetY = vertexPositions.get(edge.target)!.y;
    const interval: Interval = [Math.min(sourceY, targetY), Math.max(sourceY, targetY)];
    edgeToInterval.set(edge, interval);
  });

  edges.forEach((edge) => {
    conflictGraph.addVertex(edge);
  });

  edges.sort((a, b) => edgeToInterval.get(a)![0] - edgeToInterval.get(b)![0]);
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      const intervalA = edgeToInterval.get(edges[i])!;
      const intervalB = edgeToInterval.get(edges[j])!;
      if (intervalA[1] > intervalB[0]) {
        // Since edges are sorted, no need to check further
        break;
      }
      if (intervalA[0] != intervalB[0] && intervalA[1] != intervalB[1]) {
        conflictGraph.addEdge(new Edge(edges[i], edges[j]));
      }
    }
  }

  return conflictGraph;
}
