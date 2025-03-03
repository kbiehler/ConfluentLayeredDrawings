import { Edge, LayerGraph, Vertex } from "@/model/ds";
import _ from "lodash";

export function postProcessCliqueShift(
  yPos: Map<Vertex, number>, //
  g: LayerGraph,
  vertBundeling: Map<Edge, number>,
  maxDistance: number = 50
): Map<Vertex, number> {
  for (let i = 1; i < g.getLayerCount(); i += 2) {
    const layerPrev = getSortedLayer(g, i - 1, yPos);
    const layer = getSortedLayer(g, i, yPos);
    const layerNext = getSortedLayer(g, i + 1, yPos);

    for (let j = 0; j < layer.length; j++) {
      const [v, y] = layer[j];
      if (g.inDegree(v) === 1) {
        const optPos = computOptPosition(yPos, g, v);
        if (Math.abs(optPos - y) > 50) {
          continue;
        }

        if (layer.find(([_, y]) => y === optPos)) {
          break;
        }

        //find vertex on nextWithY that has the same y as v
        const otherV = layerNext.find(([_, y]) => y === optPos);

        let minRightVertLayer = Infinity;
        if (otherV) {
          const rightEdges = g.getIncidentIn(otherV[0]);
          minRightVertLayer = Math.min(minRightVertLayer, ...rightEdges.filter((e) => e.source === v).map((e) => vertBundeling.get(e)!));
        }
        const leftEdges = g.getIncidentOut(v);
        let maxLeftVertLayer = Math.max(...leftEdges.map((e) => vertBundeling.get(e)!));

        if (maxLeftVertLayer < minRightVertLayer) {
          yPos.set(v, optPos);
        }
      } else if (g.outDegree(v) === 1) {
        const optPosition = yPos.get(g.getAdjacentOut(v)[0])!;
        if (Math.abs(optPosition - y) > 50) {
          continue;
        }

        if (layer.find(([_, y]) => y === optPosition)) {
          break;
        }

        //find vertex on nextWithY that has the same y as v
        const otherV = layerPrev.find(([_, y]) => y === optPosition);

        let maxLeftVertLayer = -Infinity;
        if (otherV) {
          const leftEdges = g.getIncidentOut(otherV[0]);
          maxLeftVertLayer = Math.max(maxLeftVertLayer, ...leftEdges.filter((e) => e.target === v).map((e) => vertBundeling.get(e)!));
        }
        const rightEdges = g.getIncidentIn(v);
        let minRightVertLayer = Math.min(...rightEdges.map((e) => vertBundeling.get(e)!));

        if (maxLeftVertLayer < minRightVertLayer) {
          yPos.set(v, optPosition);
        }
      }
    }
  }
  return yPos;
}

function computOptPosition(yPos: Map<Vertex, number>, g: LayerGraph<Vertex, Edge<Vertex>>, v: Vertex) {
  return yPos.get(g.getAdjacentIn(v)[0])!;
}

function getSortedLayer(g: LayerGraph, layer: number, yPos: Map<Vertex, number>): [Vertex, number][] {
  return _.sortBy(
    g.getVerticesInLayer(layer).map((v) => [v, yPos.get(v)!] as [Vertex, number]),
    ([_, y]) => y
  );
}
