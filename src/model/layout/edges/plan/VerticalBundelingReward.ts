import { Edge, Graph } from "@/model/ds";

type Interval = [number, number];

export function createRewardGraph<V>(vertexPosition: (v: V) => number, conflictGraph: Graph<Edge<V>>): Graph<Edge<V>> {
  const rewardGraph = new Graph<Edge<V>>(); //conflict graph between edges of the input graph
  const edgeToInterval = new Map<Edge<V>, Interval>();

  const edges = conflictGraph.getVertices();

  conflictGraph.getVertices().forEach((edge) => {
    const sourceY = vertexPosition(edge.source);
    const targetY = vertexPosition(edge.target);
    const interval: Interval = [Math.min(sourceY, targetY), Math.max(sourceY, targetY)];
    edgeToInterval.set(edge, interval);
  });

  conflictGraph.getVertices().forEach((edge) => {
    rewardGraph.addVertex(edge);
  });

  edges.sort((a, b) => edgeToInterval.get(a)![0] - edgeToInterval.get(b)![0]);
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      if (conflictGraph.getAdjacent(edges[i]).includes(edges[j])) {
        break;
      }
      const intervalA = edgeToInterval.get(edges[i])!;
      const intervalB = edgeToInterval.get(edges[j])!;
      if (intervalA[1] < intervalB[0]) {
        // Since edges are sorted, no need to check further
        break;
      }
      const intersectionLength = Math.min(intervalA[1], intervalB[1]) - Math.max(intervalA[0], intervalB[0]);
      if (intersectionLength > 0) {
        rewardGraph.addEdge(new Edge(edges[i], edges[j], intersectionLength));
      }
    }
  }

  return rewardGraph;
}
