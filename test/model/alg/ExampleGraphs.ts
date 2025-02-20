import { Graph, Edge } from "../../../src/model/ds/Graph";

export const createWheelGraph = (n: number): Graph<Number, Edge<Number>> => {
  const G = new Graph<Number, Edge<Number>>();
  const center = 0;
  for (let i = 0; i < n; i++) {
    G.addVertex(i);
  }
  for (let i = 1; i < n; i++) {
    G.addEdge(new Edge(center, i));
  }
  for (let i = 1; i < n - 1; i++) {
    G.addEdge(new Edge(i, i + 1));
  }
  G.addEdge(new Edge(n - 1, 1));
  return G;
};

export const createRandomGraph = (n: number, p: number): Graph<Number, Edge<Number>> => {
  const randomGraph = new Graph<Number, Edge<Number>>();
  for (let i = 0; i < n; i++) {
    randomGraph.addVertex(i);
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        randomGraph.addEdge(new Edge(i, j));
      }
    }
  }
  return randomGraph;
};