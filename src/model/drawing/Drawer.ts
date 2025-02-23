import { LayerGraph } from "@/model/ds/LayerGraph";
import { GraphDrawing } from "./GraphDrawing";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";

export type DrawingAlgorithmCfg = {
  vertexPosition: VertexPositionCfg;
};

export function straightLineDrawing(g: LayerGraph<any, any>, cfg: DrawingAlgorithmCfg): GraphDrawing {
  const drawing = new GraphDrawing();

  new VertexPositioner(cfg.vertexPosition).barycenterPositions(g).forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos.x, pos.y, true, vertex.toString());
  });

  return drawing;
}
