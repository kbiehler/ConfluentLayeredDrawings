import { Graph, Edge } from "@/model/ds/";
import { GraphLayout } from "./GraphLayout";
import { LayoutVertex, VertexId } from "@/model/layout/Vertex";
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
export function generateLayout<V>(inputG: Graph<V>, cfg: GraphLayoutCfg): [GraphLayout, InteractionInfo] {
  const g = convertToLayoutVertices(inputG);

  const drawing = new GraphLayout();
  let layerGraph = assignLayers(g);

  let bliCliqueGraph = addBlicliqueCenters(layerGraph, cfg.biCliqueDepth);
  const vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(bliCliqueGraph);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex.getId(), pos, !vertex.isCliqueCenter(), vertex.getLabel());
  });

  let adjEdges = drawEdges(cfg.edgeAlg, bliCliqueGraph, (v: LayoutVertex) => vertexPositions.get(v)!, drawing);
  let adjVertices = new Map<VertexId, Set<VertexId>>();
  g.getVertices().forEach((v) => adjVertices.set(v.getId(), new Set(g.getAdjacent(v).map((v) => v.getId()))));
  return [drawing, { adjEdges, adjVertices }];
}

function convertToLayoutVertices<V>(g: Graph<V>): Graph<LayoutVertex> {
  const newGraph = new Graph<LayoutVertex>();
  const vToNew = new Map<V, LayoutVertex>();
  g.getVertices().forEach((v) => {
    const newV = new LayoutVertex(v);
    newGraph.addVertex(newV);
    vToNew.set(v, newV);
  });
  g.getEdges().forEach((edge) => {
    newGraph.addEdge(new Edge(vToNew.get(edge.source)!, vToNew.get(edge.target)!));
  });
  return newGraph;
}
