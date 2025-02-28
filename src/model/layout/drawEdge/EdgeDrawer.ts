import { Point2d } from "@/model/types/Point";
import { GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import { v4 as uuidv4 } from "uuid";
import { LayerGraph } from "@/model/ds/";
import { drawVerticalBundeling } from "./VerticalBundelingDrawer";
import { LayoutVertex, VertexId } from "../Vertex";

export enum EdgeDrawingAlgorithm {
  STRAIGHT_LINE = "straight lines",
  VERTICAL_BUNDELING = "vertical bundeling",
}

/**
 *
 * @param alg
 * @param g
 * @param vertexPositions
 * @param layout
 * @returns Vertex to the IDs of adjacent edges in the GraphLayout. (later used in InteractionManager to highlight edges)
 */
export function drawEdges(alg: EdgeDrawingAlgorithm, g: LayerGraph<LayoutVertex>, vertexPositions: Map<LayoutVertex, Point2d>, layout: GraphLayout): Map<VertexId, Set<string>> {
  switch (alg) {
    case EdgeDrawingAlgorithm.STRAIGHT_LINE:
      return drawStaightLine(g, vertexPositions, layout);
    case EdgeDrawingAlgorithm.VERTICAL_BUNDELING:
      return drawVerticalBundeling(g, vertexPositions, layout);
  }
}

export function drawStaightLine(g: LayerGraph<LayoutVertex>, vertexPositions: Map<LayoutVertex, Point2d>, layout: GraphLayout): Map<VertexId, Set<string>> {
  const adjEdges = new Map<VertexId, Set<string>>();
  g.getVertices().forEach((v) => adjEdges.set(v.getId(), new Set()));
  g.getEdges().forEach((edge) => {
    const id = uuidv4();
    layout.addEdgeDrawing({ id: id, points: [vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!] });
    adjEdges.get(edge.source.getId())!.add(id);
    adjEdges.get(edge.target.getId())!.add(id);
  });
  return adjEdges;
}
