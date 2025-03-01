import { LayerGraph, convertLayerToBiGraph, Edge, BipartiteGraph } from "@/model/ds/";
import { createConflictGraph } from "../plan/VerticalBundelingConflict";
import { rlfColoring } from "@/model/alg/Coloring";
import { verticalLayerOrdering } from "../plan/VerticalLayerOrdering";
import { Vertex } from "@/model/ds/Vertex";
import { EdgePlan } from "../plan/EdgePlan";

export function drawVerticalBundeling(
  g: LayerGraph, //
  yPosition: (v: Vertex) => number
): EdgePlan[] {
  let edgeSpecs: EdgePlan[] = [];
  const nLayers = g.getLayerCount();
  for (let layer = 0; layer < nLayers - 1; layer++) {
    const biGraph = convertLayerToBiGraph(g, layer);
    const tmpVerticLayers = assignLayers(biGraph, yPosition);
    const tmpVerticLayersSpecs = tmpVerticLayers //
      .flatMap((edges, i) => Array.from(edges).map((edge) => ({ edge: edge, source: edge.source, target: edge.target, relativeVertLayer: i, layer: layer } as EdgePlan)));
    edgeSpecs.push(...tmpVerticLayersSpecs);
  }
  return edgeSpecs;
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
