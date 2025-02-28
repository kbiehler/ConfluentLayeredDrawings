import { Graph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { VertexPositioner, VertexPositionCfg } from "@/model/layout/positioning/VertexPositioner";

import { InteractionInfo } from "../renderer/InteractionManager";
import { EdgeDrawingAlgorithm, drawEdges } from "@/model/layout/drawEdge/EdgeDrawer";
import { assignLayers } from "./leveling/LevelAssigner";
import { addBlicliqueCenters } from "./bicliqueCenter/BiCliqueCenters";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
  edgeAlg: EdgeDrawingAlgorithm;
  biCliqueDepth: number;
};

export class LayoutVertex<V> {
  payload: V | "TreeCenter";

  constructor(payload: V | "TreeCenter") {
    this.payload = payload;
  }

  isTreeCenter(): boolean {
    return this.payload === "TreeCenter";
  }
}

/**
 *
 * @param g contains no circles
 * @param cfg
 * @returns
 */
export function generateLayout<V>(g: Graph<V>, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();
  let layerGraph = assignLayers(g);

  for (let i = 0; i < cfg.biCliqueDepth; i++) {
    layerGraph = addBlicliqueCenters(layerGraph);
  }

  const vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(layerGraph);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos, vertex instanceof LayoutVertex, String(vertex));
  });

  let adjEdges = drawEdges(cfg.edgeAlg, layerGraph, vertexPositions, drawing);
  let adjVertices = new Map<V, Set<V>>();
  g.getVertices().forEach((v) => adjVertices.set(v, new Set(g.getAdjacent(v))));
  return [drawing, { adjEdges, adjVertices }];
}
