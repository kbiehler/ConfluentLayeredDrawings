import { LayerGraph } from "@/model/ds/LayerGraph";
import { GraphDrawing } from "./GraphDrawing";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";

export function straightLineDrawing(g: LayerGraph<any, any>): GraphDrawing {
  const drawing = new GraphDrawing();
  const cfg = new VertexPositionCfg();

  new VertexPositioner(cfg).computeVertexPositions(g).forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos.x, pos.y, true, vertex.toString());
  });

  return drawing;
}
