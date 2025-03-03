import { BipartiteGraph, Edge, Graph, LayerGraph } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { Vertex } from "@/model/ds/Vertex";
import { VertexId } from "@/model/types";
import { VertexPositioner, VertexPositionCfg } from "@/model/layout/positioning/VertexPositioner";
import { assignLayers } from "./leveling/LevelAssigner";
import { addBlicliqueCenters } from "./bicliqueCenter/BiCliqueCenters";
import { drawEdges } from "./edges/draw/EdgeDrawer";
import { createVertexSpacer, VertexSpacer, VertexSpacerConfig } from "./spacing/VertexSpacer";
import { FixedVerticalSpacerCfg } from "./spacing/FixedVerticalSpacer";
import { FixedLayerSpacerCfg } from "./spacing/FixedLayerSpacer";
import { LayerSpacer, layerSpacerFromCfg } from "./spacing/LayerSpacer";
import { addCliqueCenterPositons } from "./bicliqueCenter/CliqueCenterPositioner";
import { computeScaledPositions } from "./positioning/VertexScaler";
import { computeVerticalBundeling } from "./edges/plan/VerticalBundeling";
import { EdgePlan } from "./edges/plan/EdgePlan";
import { postProcessCliqueShift as postProcessBicliqueShift } from "./bicliqueCenter/PostProcessClique";
import { EdgeDrawingAlgorithm } from "./edges/EdgeDrawingAlgorithm";
import { InteractionInfo } from "../renderer/InteractionManager";
import _ from "lodash";
import { BiCliqueCfg } from "@/cfg/ConfigDtos";

export type GraphLayoutCfg = {
  vertexPosition: VertexPositionCfg;
  edgeAlg: EdgeDrawingAlgorithm;
  biClique: BiCliqueCfg;
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
  let layerGraph: LayerGraph;
  //for example graphs that are already layered
  if (g instanceof BipartiteGraph) {
    layerGraph = g;
  } else {
    layerGraph = assignLayers(g);
  }

  let vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(layerGraph);

  let biCliqueGraph = addBlicliqueCenters(layerGraph, cfg.biClique.bicliqueDepth);

  vertexPositions = addCliqueCenterPositons(biCliqueGraph, vertexPositions, cfg.biClique.bicliqueDepth);

  vertexPositions = computeScaledPositions(biCliqueGraph, vertexPositions, cfg.vertexPosition.yDist);

  let vertBundeling = computeVerticalBundeling(biCliqueGraph, (v) => vertexPositions.get(v)!);

  if (cfg.biClique.bicliqueDepth > 0 && cfg.biClique.postProcessShift) {
    vertexPositions = postProcessBicliqueShift(vertexPositions, biCliqueGraph, vertBundeling, cfg.vertexPosition.yDist);
  }

  const edgePlans = generateEdgePlans(vertBundeling, biCliqueGraph);

  const vertexSpacer = createVertexSpacer(biCliqueGraph, cfg.vertexSpacing);

  const layerSpacer = initLayerSpacer(cfg, vertexSpacer, biCliqueGraph, edgePlans);

  const layout = new GraphLayout();

  let adjEdges = drawEdges(
    biCliqueGraph,
    layout,
    (v: Vertex) => vertexPositions.get(v)!,
    (v: Vertex) => v.isCliqueCenter(),
    edgePlans,
    layerSpacer
  );

  addVerticesToLayout(vertexPositions, layout, layerSpacer, vertexSpacer, biCliqueGraph);

  const interactInfo = createInteractInfo(adjEdges, layerGraph);

  return [layout, interactInfo];
}

function initLayerSpacer(cfg: GraphLayoutCfg, vertexSpacer: VertexSpacer, biCliqueGraph: LayerGraph<Vertex, Edge<Vertex>>, edgePlans: EdgePlan[]) {
  const layerSpacer = layerSpacerFromCfg(cfg.layerSpacing, vertexSpacer);
  layerSpacer.setGraph(biCliqueGraph);
  layerSpacer.setNumVertLayer(countVertLayers(edgePlans));
  return layerSpacer;
}

function createInteractInfo(adjEdges: Map<Vertex, Set<string>>, inputGraph: LayerGraph<Vertex, Edge<Vertex>>): InteractionInfo {
  let idAdjEdges = new Map<VertexId, Set<string>>();
  adjEdges.forEach((edges, v) => idAdjEdges.set(v.getId(), edges));
  let idAdjVertices = new Map<VertexId, Set<VertexId>>();
  inputGraph.getVertices().forEach((v) => idAdjVertices.set(v.getId(), new Set(inputGraph.getAdjacent(v).map((v) => v.getId()))));

  return { adjEdges: idAdjEdges, adjVertices: idAdjVertices };
}

function addVerticesToLayout(
  vertexPositions: Map<Vertex, number>,
  drawing: GraphLayout,
  vertLayerSpacer: LayerSpacer,
  vertexSpacer: VertexSpacer,
  biCliqueGraph: LayerGraph<Vertex, Edge<Vertex>>
) {
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
}

function countVertLayers(plan: EdgePlan[]): number[] {
  const byLayer = _.groupBy(plan, (spec) => spec.layer);
  const maxVal = _.mapValues(byLayer, (group) => _.maxBy(group, "relativeVertLayer")!.relativeVertLayer);
  const result = Array.from({ length: Object.keys(maxVal).length }, (_, i) => maxVal[i] + 1);
  return result;
}

function generateEdgePlans(vertBundeling: Map<Edge, number>, biCliqueGraph: LayerGraph) {
  return Array.from(vertBundeling).map(
    ([edge, relativeLayer]) =>
      ({ edge: edge, source: edge.source, target: edge.target, relativeVertLayer: relativeLayer, layer: biCliqueGraph.getLayer(edge.source) } as EdgePlan)
  );
}
