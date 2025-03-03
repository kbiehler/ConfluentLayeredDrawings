import { LayerGraph, convertLayerToBiGraph, Edge, BipartiteGraph } from "@/model/ds/";
import { createConflictGraph } from "../plan/VerticalBundelingConflict";
import { rlfColoring } from "@/model/alg/Coloring";
import { verticalLayerOrdering } from "../plan/VerticalLayerOrdering";
import { Vertex } from "@/model/ds/Vertex";

export function computeVerticalBundeling(
  g: LayerGraph, //
  yPosition: (v: Vertex) => number
): Map<Edge, number> {
  let edgeToVertLayer = new Map<Edge, number>();
  const nLayers = g.getLayerCount();
  for (let layer = 0; layer < nLayers - 1; layer++) {
    const biGraph = convertLayerToBiGraph(g, layer);
    const tmpVerticLayers = assignLayers(biGraph, yPosition);
    tmpVerticLayers.forEach((edges, i) => {
      edges.forEach((edge) => {
        edgeToVertLayer.set(edge, i);
      });
    });
  }
  return edgeToVertLayer;
}

/**
 * assigns each edge to a layer,
 * using a coloring heuristic to bundle the edges and a
 * greedy FAS algorithm to order the bundled edges s.t. crossings are minimized
 *
 * @param g
 * @param vertexPositions
 * @returns integers (starting at 0) that map each edge to its vert layer
 */
function assignLayers(biGraph: BipartiteGraph, vertexPosition: (v: Vertex) => number): Set<Edge<Vertex>>[] {
  const conflictGraph = createConflictGraph(biGraph, vertexPosition);
  let bundeling = rlfColoring(conflictGraph);
  let orderedEdges = verticalLayerOrdering(vertexPosition, bundeling);
  return orderedEdges;
}
