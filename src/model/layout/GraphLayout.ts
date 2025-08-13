import { Point2d } from "../types/Point";
import { VertexId } from "@/model/types";

export interface VertexLayout {
  id: VertexId;
  draw: boolean;
  position: Point2d;
  width: number;
  height: number;
  label: string;
  displayLabel: string;
}

export interface EdgeLayout {
  id: string;
  points: Point2d[];
}

export class GraphLayout {
  private vertices: Map<string, VertexLayout>;
  private edges: EdgeLayout[];

  constructor(vertices: Map<string, VertexLayout> = new Map<string, VertexLayout>(), edges: EdgeLayout[] = []) {
    this.vertices = vertices;
    this.edges = edges;
  }

  addVertex(
    id: any, //
    position: Point2d,
    draw: boolean,
    width: number,
    height: number,
    label: string = "",
    displayLabel: string = ""
  ): void {
    if (!this.vertices.has(id)) {
      this.vertices.set(id, { id, position, draw, label, displayLabel, width, height });
    } else {
      throw new Error(`Vertex with id ${id} already exists.`);
    }
  }

  addEdgeDrawing(e: EdgeLayout): void {
    this.edges.push(e);
  }

  getVertices(): VertexLayout[] {
    return Array.from(this.vertices.values());
  }

  getEdgeDrawings(): EdgeLayout[] {
    return this.edges;
  }

  /**
   * needed shift of coordinate system to see everything
   * @returns
   */
  getShift(): [number, number] {
    if (this.vertices.size === 0) {
      return [0, 0];
    }
    const minX = Math.min(...Array.from(this.vertices.values()).map((v) => v.position.x - v.width / 2));
    const minY = Math.min(...Array.from(this.vertices.values()).map((v) => v.position.y - v.height / 2));
    return [-minX, -minY];
  }

  getSize(): [number, number] {
    if (this.vertices.size === 0) {
      return [0, 0];
    }
    const minX = Math.min(...Array.from(this.vertices.values()).map((v) => v.position.x - v.width / 2));
    const maxX = Math.max(...Array.from(this.vertices.values()).map((v) => v.position.x + v.width / 2));

    const minY = Math.min(...Array.from(this.vertices.values()).map((v) => v.position.y - v.height / 2));
    const maxY = Math.max(...Array.from(this.vertices.values()).map((v) => v.position.y + v.height / 2));
    return [maxX - minX, maxY - minY];
  }
}
