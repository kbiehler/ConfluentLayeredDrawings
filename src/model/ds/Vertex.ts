import { v4 as uuidv4 } from "uuid";
import { VertexId } from "@/model/types";

/**
 * Default Vertex type that has already relevant fields for the layout.
 *
 * The Graph class is generic and can be used with any type of vertex.
 *
 */
export class Vertex {
  label: string;
  id: VertexId;

  constructor(label: any) {
    this.label = String(label);
    this.id = new VertexId(label);
  }

  public getId(): VertexId {
    return this.id;
  }

  public getLabel(): string {
    return this.label;
  }

  public isCliqueCenter(): boolean {
    return false;
  }
}

export class CliqueCenter extends Vertex {
  constructor() {
    super(uuidv4());
  }

  public isCliqueCenter(): boolean {
    return true;
  }
}
