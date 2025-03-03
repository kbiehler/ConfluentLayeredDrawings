import { Edge, LayerGraph, Vertex } from "@/model/ds";
import _ from "lodash";

export function postProcessCliqueShift(
  yPos: Map<Vertex, number>, //
  g: LayerGraph,
  vertBundeling: Map<Edge, number>,
  minSpacing: number = 50
): Map<Vertex, number> {
  for (let i = 1; i < g.getLayerCount(); i += 2) {
    const layerPrev = getSortedLayer(g, i - 1, yPos);
    const layer = getSortedLayer(g, i, yPos);
    const layerNext = getSortedLayer(g, i + 1, yPos);

    for (let j = 0; j < layer.length; j++) {
      const [v, y] = layer[j];

      const optPos = computeOptPosition(yPos, g, v);
      if (optPos === undefined) continue;
      if (optPos === y) continue;
      //shift by at most 1/2 layer, this way we only have to consider if unique verticalBundeling is violated locally
      if (Math.abs(optPos - y) > minSpacing) continue;
      if (violatesMinSpacing(layer, optPos, y, minSpacing)) continue;

      //check violation to previous layer
      const prevSameY = getAtY(layerPrev, optPos);
      const nextSameY = getAtY(layerNext, optPos);
      console.log(prevSameY, nextSameY);
      console.log(maxVertRightLayer(prevSameY, v, g, vertBundeling), minVertLeftLayer(v, prevSameY, g, vertBundeling));
      console.log(maxVertRightLayer(v, nextSameY, g, vertBundeling), minVertLeftLayer(nextSameY, v, g, vertBundeling));
      if (maxVertRightLayer(prevSameY, v, g, vertBundeling) >= minVertLeftLayer(v, prevSameY, g, vertBundeling)) continue;
      //check violation to next layer
      if (maxVertRightLayer(v, nextSameY, g, vertBundeling) >= minVertLeftLayer(nextSameY, v, g, vertBundeling)) continue;

      //shift v to optPos
      yPos.set(v, optPos);
    }
  }
  return yPos;
}

/**
 * computes the maximal vertical layer that v uses to its right
 * ignores the edge towards vIgnore (this is the edge that we change)
 *
 * @param v
 * @param g
 * @param vIgnore
 * @param vertBundeling
 * @returns
 */
function maxVertRightLayer(
  v: Vertex | undefined, //
  vIgnore: Vertex | undefined,
  g: LayerGraph<Vertex, Edge<Vertex>>,
  vertBundeling: Map<Edge<Vertex>, number>
) {
  if (!v) {
    return -Infinity;
  }
  const rightEdges = g.getIncidentOut(v);
  return Math.max(-Infinity, ...rightEdges.filter((e) => e.target != vIgnore).map((e) => vertBundeling.get(e)!));
}

/**
 * computes the minimal vertical layer that v uses to its left
 * ignores the edge towards vIgnore (this is the edge that we change)
 *
 * @param v
 * @param g
 * @param vIgnore
 * @param vertBundeling
 * @returns
 */
function minVertLeftLayer(v: Vertex | undefined, vIgnore: Vertex | undefined, g: LayerGraph<Vertex, Edge<Vertex>>, vertBundeling: Map<Edge<Vertex>, number>) {
  if (!v) {
    return Infinity;
  }
  const leftEdges = g.getIncidentIn(v);
  return Math.min(Infinity, ...leftEdges.filter((e) => e.source != vIgnore).map((e) => vertBundeling.get(e)!));
}

function violatesMinSpacing(layer: [Vertex, number][], optPos: number, oldPosition: number, minDistance: number) {
  return layer
    .map(([_, y]) => y)
    .filter((y) => y != optPos && y != oldPosition)
    .find((y) => Math.abs(optPos - y) < minDistance);
}

function computeOptPosition(yPos: Map<Vertex, number>, g: LayerGraph<Vertex, Edge<Vertex>>, v: Vertex) {
  if (g.getIncidentIn(v).length === 1) {
    return yPos.get(g.getIncidentIn(v)[0].source)!;
  }
  if (g.getIncidentOut(v).length === 1) {
    return yPos.get(g.getIncidentOut(v)[0].target)!;
  }
  return undefined;
}

function getSortedLayer(g: LayerGraph, layer: number, yPos: Map<Vertex, number>): [Vertex, number][] {
  return _.sortBy(
    g.getVerticesInLayer(layer).map((v) => [v, yPos.get(v)!] as [Vertex, number]),
    ([_, y]) => y
  );
}
function getAtY(layer: [Vertex, number][], y: number) {
  return layer.find(([_, v_y]) => v_y === y)?.[0];
}
