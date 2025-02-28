import { GraphLayout } from "@/model/layout/GraphLayout";
import { LayerGraph } from "@/model/ds/";
import { drawVerticalBundeling } from "./VerticalBundelingDrawer";
import { DynamicalLayerSpacer } from "../spacing/LayerSpacer";
import { Vertex } from "@/model/ds/Vertex";

export enum EdgeDrawingAlgorithm {
  STRAIGHT_LINE = "straight lines",
  VERTICAL_BUNDELING = "vertical bundeling",
}

/**
 *
 * @param alg
 * @param g
 * @param yPosition
 * @param layout
 * @returns Vertex to the IDs of adjacent edges in the GraphLayout. (later used in InteractionManager to highlight edges)
 */
export function drawEdges(
  alg: EdgeDrawingAlgorithm, //
  g: LayerGraph,
  yPosition: (v: Vertex) => number,
  layout: GraphLayout,
  isCliqueCenter: (v: Vertex) => boolean
): [Map<Vertex, Set<string>>, DynamicalLayerSpacer] {
  switch (alg) {
    case EdgeDrawingAlgorithm.STRAIGHT_LINE:
    // return drawStaightLine(g, yPosition, layout);
    case EdgeDrawingAlgorithm.VERTICAL_BUNDELING:
      return drawVerticalBundeling(g, yPosition, layout, isCliqueCenter);
  }
}

// export function drawStaightLine<V>(g: LayerGraph<V>, vertexPosition: (v: V) => number, layout: GraphLayout): Map<V, Set<string>> {
//   const adjEdges = new Map<V, Set<string>>();
//   g.getVertices().forEach((v) => adjEdges.set(v, new Set()));
//   g.getEdges().forEach((edge) => {
//     const id = uuidv4();
//     layout.addEdgeDrawing({ id: id, points: [vertexPosition(edge.source), vertexPosition(edge.target)] });
//     adjEdges.get(edge.source)!.add(id);
//     adjEdges.get(edge.target)!.add(id);
//   });
//   return adjEdges;
// }
