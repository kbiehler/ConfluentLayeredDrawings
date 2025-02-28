import { Graph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { Vertex } from "@/model/ds/Vertex";
import { VertexId } from "@/model/types";
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

/**
 *
 * @param g contains no circles
 * @param cfg
 * @returns
 */
export function generateLayout(g: Graph, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();
  let layerGraph = assignLayers(g);

  let bliCliqueGraph = addBlicliqueCenters(layerGraph, cfg.biCliqueDepth);
  const vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(bliCliqueGraph);

  let [adjEdges2, dyn] = drawEdges(
    cfg.edgeAlg,
    bliCliqueGraph,
    (v: Vertex) => vertexPositions.get(v)!,
    drawing,
    (v: Vertex) => v.isCliqueCenter()
  );

  vertexPositions.forEach((_, vertex) => {
    drawing.addVertex(vertex.getId(), { x: dyn.xPosition(vertex), y: vertexPositions.get(vertex)! }, !vertex.isCliqueCenter(), vertex.getLabel());
  });

  let adjEdges = new Map<VertexId, Set<string>>();
  adjEdges2.forEach((edges, v) => adjEdges.set(v.getId(), edges));

  let adjVertices = new Map<VertexId, Set<VertexId>>();
  g.getVertices().forEach((v) => adjVertices.set(v.getId(), new Set(g.getAdjacent(v).map((v) => v.getId()))));
  return [drawing, { adjEdges, adjVertices }];
}
