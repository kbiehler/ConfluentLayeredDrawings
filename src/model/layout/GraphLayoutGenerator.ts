import { Graph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { Vertex } from "@/model/ds/Vertex";
import { VertexId } from "@/model/types";
import { VertexPositioner, VertexPositionCfg } from "@/model/layout/positioning/VertexPositioner";

import { InteractionInfo } from "../renderer/InteractionManager";
import { EdgeDrawingAlgorithm, planEdges } from "@/model/layout/edges/plan/EdgePlanner";
import { assignLayers } from "./leveling/LevelAssigner";
import { addBlicliqueCenters } from "./bicliqueCenter/BiCliqueCenters";
import { draw } from "./edges/draw/EdgeDrawer";
import { CliqueCenterVertexSpacer } from "./spacing/VertexSpacer";
import { EvenVerticalWidthSpacerCfg, EvenVerticalWidthSpacer } from "./spacing/EvenVerticalWidthSpacer";

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

  let edgePlans = planEdges(cfg.edgeAlg, bliCliqueGraph, (v: Vertex) => vertexPositions.get(v)!);

  const vertexSpacer = new CliqueCenterVertexSpacer();
  const vertLayerSpacer = new EvenVerticalWidthSpacer(new EvenVerticalWidthSpacerCfg(), vertexSpacer);

  let adjEdges2 = draw(
    bliCliqueGraph,
    drawing,
    (v: Vertex) => vertexPositions.get(v)!,
    (v: Vertex) => v.isCliqueCenter(),
    edgePlans,
    vertLayerSpacer
  );

  vertexPositions.forEach((_, vertex) => {
    drawing.addVertex(
      vertex.getId(), //
      { x: vertLayerSpacer.xPosition(vertex), y: vertexPositions.get(vertex)! },
      !vertex.isCliqueCenter(),
      vertexSpacer.width(bliCliqueGraph.getLayer(vertex)),
      vertexSpacer.height(bliCliqueGraph.getLayer(vertex)),
      vertex.getLabel(),
      vertexSpacer.label(vertex)
    );
  });

  let adjEdges = new Map<VertexId, Set<string>>();
  adjEdges2.forEach((edges, v) => adjEdges.set(v.getId(), edges));
  let adjVertices = new Map<VertexId, Set<VertexId>>();
  g.getVertices().forEach((v) => adjVertices.set(v.getId(), new Set(g.getAdjacent(v).map((v) => v.getId()))));
  return [drawing, { adjEdges, adjVertices }];
}
