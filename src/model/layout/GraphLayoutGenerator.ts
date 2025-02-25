import { Graph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "./VertexPositioner";

import { InteractionInfo } from "../renderer/InteractionManager";
import { EdgeDrawingAlgorithm, drawEdges } from "./EdgeDrawer";
import { assignLayers } from "../leveling/LevelAssigner";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
  edgeAlg: EdgeDrawingAlgorithm;
};

/**
 *
 * @param g contains no circles
 * @param cfg
 * @returns
 */
export function generateLayout<V>(g: Graph<V, any>, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();

  const layerGraph = assignLayers(g);

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(layerGraph);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos, true, String(vertex));
  });

  let adjEdges = drawEdges(cfg.edgeAlg, layerGraph, vertexPositions, drawing);

  return [drawing, { adjEdges }];
}
