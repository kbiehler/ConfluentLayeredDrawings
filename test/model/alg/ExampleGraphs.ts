import { Graph, Edge } from "../../../src/model/ds/Graph";

export const createWheelGraph = (n: number): Graph<Number, Edge<Number>> => {
  const wheelGraph = new Graph<Number, Edge<Number>>();
  const center = 0;
  for (let i = 0; i < n; i++) {
    wheelGraph.addVertex(i);
  }
  for (let i = 1; i < n; i++) {
    wheelGraph.addEdge(new Edge(center, i));
  }
  for (let i = 1; i < n - 1; i++) {
    wheelGraph.addEdge(new Edge(i, i + 1));
  }
  wheelGraph.addEdge(new Edge(n - 1, 1));
  return wheelGraph;
};
