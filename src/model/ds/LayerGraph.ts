import { Graph, Edge } from "./Graph";

export class LayerGraph<V, E extends Edge<V>> extends Graph<V, E> {
  vertexToLayer = new Map<V, number>();
  layerToVertex = new Map<number, Set<V>>();

  constructor() {
    super();
    this.vertexToLayer = new Map<V, number>();
    this.layerToVertex = new Map<number, Set<V>>();
  }

  addVertex(_: V): void {
    throw new Error("Use addVertexToLayer for layerGraphs");
  }

  addVertexToLayer(vertex: V, layer: number): void {
    super.addVertex(vertex);
    this.vertexToLayer.set(vertex, layer);
    if (!this.layerToVertex.has(layer)) {
      this.layerToVertex.set(layer, new Set<V>());
    }
    this.layerToVertex.get(layer)!.add(vertex);
  }

  addEdge(edge: E): void {
    if ((this.vertexToLayer.get(edge.source) ?? -2) + 1 == (this.vertexToLayer.get(edge.target) ?? -2)) {
      super.addEdge(edge);
    } else {
      throw new Error("Edge must start in layer i and end in layer i+1");
    }
  }

  getVerticesInLayer(layer: number): V[] {
    return Array.from(this.layerToVertex.get(layer) || []);
  }

  getLayer(vertex: V): number {
    return this.vertexToLayer.get(vertex)!;
  }

  /**
   *
   * @param layer all edges between layer and next layer
   * @returns
   */
  getEdgesBetween(layer: number): E[] {
    return this.getVerticesInLayer(layer).flatMap((vertex) => this.getIncidentDirected(vertex));
  }

  getNumLayers(): number {
    if (this.vertexToLayer.size === 0) {
      return 0;
    }
    return Math.max(...Array.from(this.vertexToLayer.values())) + 1;
  }

  deleteVertex(vertex: V): void {
    super.deleteVertex(vertex);
    const layer = this.getLayer(vertex);
    this.vertexToLayer.delete(vertex);
    this.layerToVertex.get(layer)!.delete(vertex);
  }
}
