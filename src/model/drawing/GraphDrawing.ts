import { Point2d } from "../types/Point";

export interface VertexDrawing {
  id: string;
  draw: boolean;
  position: Point2d;
  label: string;
}

export interface EdgeDrawing {
  id: string;
  points: Point2d[];
}

export class GraphDrawing {
  private vertices: Map<string, VertexDrawing>;
  private edges: EdgeDrawing[];

  constructor(vertices: Map<string, VertexDrawing> = new Map<string, VertexDrawing>(), edges: EdgeDrawing[] = []) {
    this.vertices = vertices;
    this.edges = edges;
  }

  addVertex(id: string, position: Point2d, draw: boolean, label: string = ""): void {
    if (!this.vertices.has(id)) {
      this.vertices.set(id, { id, position, draw, label });
    } else {
      throw new Error(`Vertex with id ${id} already exists.`);
    }
  }

  addEdgeDrawing(e: EdgeDrawing): void {
    this.edges.push(e);
  }

  getVertices(): VertexDrawing[] {
    return Array.from(this.vertices.values());
  }

  getEdgeDrawings(): EdgeDrawing[] {
    return this.edges;
  }

  getSize(): [number, number] {
    if (this.vertices.size === 0) {
      return [0, 0];
    }
    const maxX = Math.max(...Array.from(this.vertices.values()).map((v) => v.position.x));
    const maxY = Math.max(...Array.from(this.vertices.values()).map((v) => v.position.y));
    return [maxX, maxY];
  }
}
