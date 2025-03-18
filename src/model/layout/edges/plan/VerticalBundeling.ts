import { LayerGraph, convertLayerToBiGraph, Edge, BipartiteGraph, Graph } from "@/model/ds/";
import { createConflictGraph } from "./VerticalBundelingConflict";
import { rlfColoring } from "@/model/alg/Coloring";
import { verticalLayerOrdering } from "./VerticalLayerOrdering";
import { Vertex } from "@/model/ds/Vertex";
import { createRewardGraph } from "./VerticalBundelingReward";

/**
 * compute the vertical bundeling
 *
 * assigns each edge to a color. starts at 0 for each layer
 * @param g
 * @param yPosition
 * @returns
 */
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
  const rewardGraph = createRewardGraph(vertexPosition, conflictGraph);
  // bundeling = improveColoring(bundeling, conflictGraph, rewardGraph);
  // let bundeling2 = solveBundelingLp(conflictGraph);
  let orderedEdges = verticalLayerOrdering(vertexPosition, bundeling);
  return orderedEdges;
}

function improveColoring(coloring: Set<Edge<Vertex>>[], conflictGraph: Graph<Edge<Vertex>>, rewardGraph: Graph<Edge<Vertex>>): Set<Edge<Vertex>>[] {
  const colors = new Map<Edge<Vertex>, number>();
  let color = 0;
  coloring.forEach((edgesSameColor) => {
    edgesSameColor.forEach((edge) => colors.set(edge, color));
    color++;
  });
  let improvement = 0;
  for (let i = 0; i < 10; i++) {
    conflictGraph.getVertices().forEach((v) => {
      let bestReward = 0;
      let bestColor = -1;
      let currReward = 0;
      for (let c = 0; c < color; c++) {
        if (conflictGraph.getAdjacent(v).some((e) => colors.get(e) === c)) {
          continue;
        }
        let reward = 0;
        rewardGraph.getIncident(v).forEach((e) => {
          const u = e.source === v ? e.target : e.source;
          if (colors.get(u) === c) {
            reward += e.weight;
          }
        });
        if (c === colors.get(v)) {
          currReward = reward;
        }
        if (reward > bestReward) {
          // console.log("found improvement");
          bestReward = reward;
          bestColor = c;
        }
      }
      if (bestColor !== -1 && bestColor !== colors.get(v)) {
        improvement += bestReward - currReward;
        colors.set(v, bestColor);
      }
    });
  }
  console.log("improvement", improvement);
  const result = [];
  for (let i = 0; i < color; i++) {
    const c = new Set<Edge<Vertex>>();
    colors.forEach((color, edge) => {
      if (color === i) {
        c.add(edge);
      }
    });
    result.push(c);
  }

  return result;
}
