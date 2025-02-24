import { LayerGraph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";

import { InteractionInfo } from "../renderer/InteractionManager";
import { EdgeDrawingAlgorithm, drawEdges } from "./EdgeDrawer";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
  edgeAlg: EdgeDrawingAlgorithm;
};

export function generateLayout<V>(g: LayerGraph<V, any>, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).barycenterPositions(g);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos, true, String(vertex));
  });

  let adjEdges = drawEdges(cfg.edgeAlg, g, vertexPositions, drawing);

  return [drawing, { adjEdges }];
}
