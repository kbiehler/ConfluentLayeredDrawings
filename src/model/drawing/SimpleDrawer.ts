import { LayerGraph } from "@/model/ds/LayerGraph";
import { GraphDrawing } from "./GraphDrawing";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";

export function straightLineDrawing(g: LayerGraph<any, any>, cfg: VertexPositionCfg): GraphDrawing {
  const drawing = new GraphDrawing();

  new VertexPositioner(cfg).barycenterPositions(g).forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos.x, pos.y, true, vertex.toString());
  });

  return drawing;
}
