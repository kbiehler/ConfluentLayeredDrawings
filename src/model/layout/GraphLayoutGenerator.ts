import { Graph, Edge } from "@/model/ds/";
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
  payload: V | "CliqueCenter";

  constructor(payload: V | "CliqueCenter") {
    this.payload = payload;
  }

  isCliqueCenter(): boolean {
    return this.payload === "CliqueCenter";
  }

  label(): string {
    if (this.isCliqueCenter()) {
      return "TreeCenter";
    } else {
      return String(this.payload);
    }
  }
}

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

  layerGraph = addBlicliqueCenters(layerGraph, cfg.biCliqueDepth);
  const vertexPositions = new VertexPositioner(cfg.vertexPosition).computePositions(layerGraph);

  vertexPositions.forEach((pos, vertex) => {
    drawing.addVertex(vertex, pos, !vertex.isCliqueCenter, vertex.label());
  });

  let adjEdges = drawEdges(cfg.edgeAlg, layerGraph, vertexPositions, drawing);
  let adjVertices = new Map<V, Set<V>>();
  return [drawing, { adjEdges, adjVertices }];
}

function convertToLayoutVertices<V>(g: Graph<V>): Graph<LayoutVertex<V>> {
  const newGraph = new Graph<LayoutVertex<V>>();
  const vToNew = new Map<V, LayoutVertex<V>>();
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
