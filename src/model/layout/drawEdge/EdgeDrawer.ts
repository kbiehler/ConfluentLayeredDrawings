import { Point2d } from "@/model/types/Point";
import { GraphLayout } from "@/model/layout/GraphLayout";
import { v4 as uuidv4 } from "uuid";
import { LayerGraph } from "@/model/ds/";
import { drawVerticalBundeling } from "./VerticalBundelingDrawer";

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
export function drawEdges<V>(alg: EdgeDrawingAlgorithm, g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, layout: GraphLayout): Map<V, Set<string>> {
  switch (alg) {
    case EdgeDrawingAlgorithm.STRAIGHT_LINE:
      return drawStaightLine(g, vertexPositions, layout);
    case EdgeDrawingAlgorithm.VERTICAL_BUNDELING:
      return drawVerticalBundeling(g, vertexPositions, layout);
  }
}

export function drawStaightLine<V>(g: LayerGraph<V, any>, vertexPositions: Map<V, Point2d>, layout: GraphLayout): Map<V, Set<string>> {
  const adjEdges = new Map<V, Set<string>>();
  g.getVertices().forEach((v) => adjEdges.set(v, new Set()));
  g.getEdges().forEach((edge) => {
    const id = uuidv4();
    layout.addEdgeDrawing({ id: id, points: [vertexPositions.get(edge.source)!, vertexPositions.get(edge.target)!] });
    adjEdges.get(edge.source)!.add(id);
    adjEdges.get(edge.target)!.add(id);
  });
  return adjEdges;
}
