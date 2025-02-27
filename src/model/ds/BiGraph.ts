import { Graph, Edge } from "./Graph";
import { LayerGraph } from "./LayerGraph";

export class BipartiteGraph<V, E extends Edge<V>> extends LayerGraph<V, E> {
  constructor() {
    super();
  }

  addVertex(vertex: V): void {
    throw new Error("Use addVertexA or addVertexB for bipartite graphs");
  }

  addVertexToLayer(vertex: V, layer: number): void {
    if (layer !== 0 && layer !== 1) {
      throw new Error("Layer must be 0 or 1 for bipartite graphs");
    }
    super.addVertexToLayer(vertex, layer);
  }

  addVertexA(vertex: V): void {
    super.addVertexToLayer(vertex, 0);
  }

  addVertexB(vertex: V): void {
    super.addVertexToLayer(vertex, 1);
  }

  getVerticesA(): V[] {
    return super.getVerticesInLayer(0);
  }

  getVerticesB(): V[] {
    return super.getVerticesInLayer(1);
  }
}

/**
 *
 * @param layer bipartite graph with vertices in layer and layer+1
 * @returns
 */
export function convertLayerToBiGraph<V, E extends Edge<V>>(layerGraph: LayerGraph<V, E>, layer: number): BipartiteGraph<V, E> {
  const g = new BipartiteGraph<V, E>();
  layerGraph.getVerticesInLayer(layer).forEach((vertex) => {
    g.addVertexA(vertex);
  });
  layerGraph.getVerticesInLayer(layer + 1).forEach((vertex) => {
    g.addVertexB(vertex);
  });
  layerGraph.getInterLayerEdges(layer).forEach((edge) => {
    g.addEdge(edge);
  });
  return g;
}
