import { Graph } from "../ds";
import { Vertex } from "../ds/Vertex";

export class RedrawState {
  g: Graph;
  public constructor(g: Graph) {
    this.g = g;
  }
}
