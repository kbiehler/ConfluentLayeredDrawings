import { Graph } from "../ds";
import { Vertex } from "../ds/Vertex";

export class RedrawState {
  g: Graph<Vertex>;
  public constructor(g: Graph<Vertex>) {
    this.g = g;
  }
}
