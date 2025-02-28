import { Graph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "../positioning/VertexPositioner";

import { InteractionInfo } from "../renderer/InteractionManager";
import { EdgeDrawingAlgorithm, drawEdges } from "../drawEdge/EdgeDrawer";
import { assignLayers } from "../leveling/LevelAssigner";
import { addBlicliqueCenters, BiCliqueCenter } from "../bicliqueCenter/BiCliqueCenters";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
  edgeAlg: EdgeDrawingAlgorithm;
  biCliqueDepth: number;
};

/**
 *
 * @param g contains no circles
 * @param cfg
 * @returns
 */
export function generateLayout<V>(g: Graph<V, any>, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();

  let layerGraph = assignLayers(g);

  for (let i = 0; i < cfg.biCliqueDepth; i++) {
    layerGraph = addBlicliqueCenters(layerGraph);
  }

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(layerGraph);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos, vertex instanceof BiCliqueCenter, String(vertex));
  });

  let adjEdges = drawEdges(cfg.edgeAlg, layerGraph, vertexPositions, drawing);
  let adjVertices = new Map<V, Set<V>>();
  g.getVertices().forEach((v) => adjVertices.set(v, new Set(g.getAdjacent(v))));
  return [drawing, { adjEdges, adjVertices }];
}
