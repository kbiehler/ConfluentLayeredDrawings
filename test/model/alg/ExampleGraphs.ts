import { Graph, Edge } from "../../../src/model/ds/Graph";
import { BipartiteGraph } from "../../../src/model/ds/BiGraph";

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

export const createRandomBiGraph = (nA: number, nB: number, p: number): BipartiteGraph<Number, Edge<Number>> => {
  const randomBiGraph = new BipartiteGraph<Number, Edge<Number>>();
  for (let i = 0; i < nA; i++) {
    randomBiGraph.addVertexA(i);
  }
  for (let j = 0; j < nB; j++) {
    randomBiGraph.addVertexB(nA + j);
  }
  for (let i = 0; i < nA; i++) {
    for (let j = 0; j < nB; j++) {
      if (Math.random() < p) {
        randomBiGraph.addEdge(new Edge(i, nA + j));
      }
    }
  }
  return randomBiGraph;
};