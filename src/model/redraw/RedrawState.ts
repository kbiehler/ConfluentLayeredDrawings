import { Graph } from "../ds";
import { LayoutVertex } from "../layout/Vertex";

export class RedrawState {
  g: Graph<LayoutVertex>;
  public constructor(g: Graph<LayoutVertex>) {
    this.g = g;
  }
}
