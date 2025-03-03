import { BipartiteGraph, Graph, LayerGraph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { Vertex } from "@/model/ds/Vertex";
import { VertexId } from "@/model/types";
import { VertexPositioner, VertexPositionCfg } from "@/model/layout/positioning/VertexPositioner";

import { InteractionInfo } from "../renderer/InteractionManager";
import { assignLayers } from "./leveling/LevelAssigner";
import { addBlicliqueCenters } from "./bicliqueCenter/BiCliqueCenters";
import { draw } from "./edges/draw/EdgeDrawer";
import { createVertexSpacer, VertexSpacerConfig } from "./spacing/VertexSpacer";
import { FixedVerticalSpacerCfg } from "./spacing/FixedVerticalSpacer";
import { FixedLayerSpacerCfg } from "./spacing/FixedLayerSpacer";
import { layerSpacerFromCfg } from "./spacing/LayerSpacer";
import { addCliqueCenterPositons } from "./positioning/CliqueCenterPositioner";
import { computeScaledPositions } from "./positioning/VertexScaler";
import { computeVerticalBundeling } from "./edges/draw/VerticalBundelingDrawer";
import { EdgePlan } from "./edges/plan/EdgePlan";
import { EdgeDrawingAlgorithm } from "./edges/plan/EdgePlanner";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
  edgeAlg: EdgeDrawingAlgorithm;
  biCliqueDepth: number;
  layerSpacing: FixedVerticalSpacerCfg | FixedLayerSpacerCfg;
  vertexSpacing: VertexSpacerConfig;
};

/**
 *
 * @param g contains no circles
 * @param cfg
 * @returns
 */
export function generateLayout(g: Graph, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const drawing = new GraphLayout();
  let layerGraph: LayerGraph;
  if (g instanceof BipartiteGraph) {
    layerGraph = g;
  } else {
    layerGraph = assignLayers(g);
  }

  let vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(layerGraph);
  let biCliqueGraph = addBlicliqueCenters(layerGraph, cfg.biCliqueDepth);
  vertexPositions = addCliqueCenterPositons(biCliqueGraph, vertexPositions, cfg.biCliqueDepth);

  vertexPositions = computeScaledPositions(biCliqueGraph, vertexPositions, cfg.vertexPosition.yDist);

  let vertBundeling = computeVerticalBundeling(biCliqueGraph, (v) => vertexPositions.get(v)!);

  const edgePlans = Array.from(vertBundeling).map(
    ([edge, relativeLayer]) =>
      ({ edge: edge, source: edge.source, target: edge.target, relativeVertLayer: relativeLayer, layer: biCliqueGraph.getLayer(edge.source) } as EdgePlan)
  );

  const vertexSpacer = createVertexSpacer(biCliqueGraph, cfg.vertexSpacing);
  const vertLayerSpacer = layerSpacerFromCfg(cfg.layerSpacing, vertexSpacer);

  let adjEdges2 = draw(
    biCliqueGraph,
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
      vertexSpacer.width(biCliqueGraph.getLayer(vertex)),
      vertexSpacer.height(biCliqueGraph.getLayer(vertex)),
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
