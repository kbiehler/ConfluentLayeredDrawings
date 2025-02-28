import { Graph, Edge } from "../model/ds/Graph";
import { BipartiteGraph } from "../model/ds/BiGraph";
import { LayerGraph } from "../model/ds/LayerGraph";

export const createWheelGraph = (n: number): Graph<Number> => {
  const G = new Graph<Number>();
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

export const createRandomGraph = (n: number, p: number): Graph<Number> => {
  const randomGraph = new Graph<Number>();
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

export const createRandomBiGraph = (nA: number, nB: number, p: number): BipartiteGraph<Number> => {
  const randomBiGraph = new BipartiteGraph<Number>();
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

export const createRandomLayeredGraph = (verticesPerLayer: number[], p: number): LayerGraph<Number> => {
  const randomLayeredGraph = new LayerGraph<Number>();
  let vertexId = 0;

  for (let layer = 0; layer < verticesPerLayer.length; layer++) {
    for (let i = 0; i < verticesPerLayer[layer]; i++) {
      randomLayeredGraph.addVertexToLayer(vertexId, layer);
      vertexId++;
    }
  }

  for (let layer = 0; layer < verticesPerLayer.length - 1; layer++) {
    const currentLayerVertices = randomLayeredGraph.getVerticesInLayer(layer);
    const nextLayerVertices = randomLayeredGraph.getVerticesInLayer(layer + 1);

    for (const u of currentLayerVertices) {
      for (const v of nextLayerVertices) {
        if (Math.random() < p) {
          randomLayeredGraph.addEdge(new Edge(u, v));
        }
      }
    }
  }

  return randomLayeredGraph;
};
