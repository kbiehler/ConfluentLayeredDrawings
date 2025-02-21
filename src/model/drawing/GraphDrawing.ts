export interface VertexDrawing {
  id: string;
  draw: boolean;
  x: number;
  y: number;
  label: String;
}

export interface EdgeDrawing {
  id: string;
  sourceVertex: string | null;
  targetVertex: string | null;
  points: [number, number][];
}

export class GraphDrawing {
  private vertices: Map<string, VertexDrawing>;
  private edges: EdgeDrawing[];

  constructor(vertices: Map<string, VertexDrawing> = new Map<string, VertexDrawing>(), edges: EdgeDrawing[] = []) {
    this.vertices = vertices;
    this.edges = edges;
  }

  addVertex(id: string, x: number, y: number, draw: boolean, label: String = ""): void {
    if (!this.vertices.has(id)) {
      this.vertices.set(id, { id, x, y, draw, label });
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
    const maxX = Math.max(...Array.from(this.vertices.values()).map((v) => v.x));
    const maxY = Math.max(...Array.from(this.vertices.values()).map((v) => v.y));
    return [maxX, maxY];
  }
}
