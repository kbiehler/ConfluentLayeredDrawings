export class Edge<V> {
  start: V;
  target: V;
  weight: number;

  constructor(start: V, target: V, weight: number = 1) {
    this.start = start;
    this.target = target;
    this.weight = weight;
  }
}

export class Graph<V, E extends Edge<V>> {
  private vertices: Set<V>;
  private edges: Set<E>;
  private adj: Map<V, Set<E>>;

  constructor() {
    this.vertices = new Set<V>();
    this.edges = new Set<E>();
    this.adj = new Map<V, Set<E>>();
  }

  addVertex(vertex: V): void {
    this.vertices.add(vertex);
    this.adj.set(vertex, new Set<E>());
  }

  addEdge(edge: E): void {
    this.edges.add(edge);
    this.adj.get(edge.start)!.add(edge);
    this.adj.get(edge.target)!.add(edge);
  }

  getEdges(): Set<E> {
    return this.edges;
  }

  getVertices(): V[] {
    return Array.from(this.vertices.values());
  }

  getAdjacent(vertex: V): V[] {
    return Array.from(this.adj.get(vertex)!).map((edge) => {
      return edge.start === vertex ? edge.target : edge.start;
    });
  }

  getIncident(vertex: V): Set<E> {
    return this.adj.get(vertex)!;
  }

  containsVertex(vertex: V): boolean {
    return this.vertices.has(vertex);
  }

  getDegree(vertex: V): number {
    return this.adj.get(vertex)!.size;
  }

  deleteEdge(edge: E): void {
    this.edges.delete(edge);
    this.adj.get(edge.start)!.delete(edge);
    this.adj.get(edge.target)!.delete(edge);
  }

  deleteVertex(vertex: V): void {
    if (this.getDegree(vertex) > 0) {
      throw new Error("Cannot remove vertex with edges");
    }
    this.vertices.delete(vertex);
  }
}
