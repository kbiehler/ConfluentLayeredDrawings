import { Vertex } from "./Vertex";

export class Edge<V = Vertex> {
  source: V;
  target: V;
  weight: number;

  constructor(start: V, target: V, weight: number = 1) {
    this.source = start;
    this.target = target;
    this.weight = weight;
  }
}

export class Graph<V = Vertex, E extends Edge<V> = Edge<V>> {
  private vertices: Set<V>;
  private edges: Set<E>;
  private adj: Map<V, Set<E>>;
  private adjDirected: Map<V, Set<E>>;

  constructor() {
    this.vertices = new Set<V>();
    this.edges = new Set<E>();
    this.adj = new Map<V, Set<E>>();
    this.adjDirected = new Map<V, Set<E>>();
  }

  public addVertex(vertex: V): void {
    this.vertices.add(vertex);
    this.adj.set(vertex, new Set<E>());
    this.adjDirected.set(vertex, new Set<E>());
  }

  addEdge(edge: E): void {
    this.edges.add(edge);
    this.adj.get(edge.source)!.add(edge);
    this.adj.get(edge.target)!.add(edge);
    this.adjDirected.get(edge.source)!.add(edge);
  }

  getEdges(): E[] {
    return Array.from(this.edges);
  }

  getVertices(): V[] {
    return Array.from(this.vertices.values());
  }

  getAdjacent(vertex: V): V[] {
    return Array.from(this.adj.get(vertex)!).map((edge) => {
      return edge.source === vertex ? edge.target : edge.source;
    });
  }

  getAdjacentIn(vertex: V): V[] {
    return this.getIncidentIn(vertex).map((edge) => edge.source);
  }

  getAdjacentOut(vertex: V): V[] {
    return this.getIncidentOut(vertex).map((edge) => edge.target);
  }

  getIncident(vertex: V): E[] {
    return Array.from(this.adj.get(vertex)!);
  }

  /**
   * returns the set of edges starting at a vertex
   * @param vertex
   */
  getIncidentOut(vertex: V): E[] {
    return Array.from(this.adjDirected.get(vertex)!);
  }

  getIncidentIn(vertex: V): E[] {
    return Array.from(this.adj.get(vertex)!).filter((edge) => edge.target === vertex);
  }

  containsVertex(vertex: V): boolean {
    return this.vertices.has(vertex);
  }

  degree(vertex: V): number {
    return this.adj.get(vertex)!.size;
  }

  outDegree(vertex: V): number {
    return this.adjDirected.get(vertex)!.size;
  }

  inDegree(vertex: V): number {
    return this.degree(vertex) - this.outDegree(vertex);
  }

  deleteEdge(edge: E): void {
    this.edges.delete(edge);
    this.adj.get(edge.source)!.delete(edge);
    this.adj.get(edge.target)!.delete(edge);
    this.adjDirected.get(edge.source)!.delete(edge);
  }

  deleteVertex(vertex: V): void {
    if (this.degree(vertex) > 0) {
      throw new Error("Cannot remove vertex with edges");
    }
    this.vertices.delete(vertex);
  }

  copy(): Graph<V, E> {
    const newGraph = new Graph<V, E>();
    this.vertices.forEach((vertex) => newGraph.addVertex(vertex));
    this.edges.forEach((edge) => newGraph.addEdge(edge));
    return newGraph;
  }
}
