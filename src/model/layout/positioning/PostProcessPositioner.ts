import { Edge, LayerGraph, Vertex } from "@/model/ds";
import _ from "lodash";

export function undoShift(
  yPos: Map<Vertex, number>, //
  g: LayerGraph,
  vertBundeling: Map<Edge, number>
): Map<Vertex, number> {
  for (let i = 1; i < g.getLayerCount(); i += 2) {
    const prevWithY = _.sortBy(
      g.getVerticesInLayer(i - 1).map((v) => [v, yPos.get(v)!] as [Vertex, number]),
      ([_, y]) => y
    );
    const layerWithY = _.sortBy(
      g.getVerticesInLayer(i).map((v) => [v, yPos.get(v)!] as [Vertex, number]),
      ([_, y]) => y
    );
    const nextWithY = _.sortBy(
      g.getVerticesInLayer(i + 1).map((v) => [v, yPos.get(v)!] as [Vertex, number]),
      ([_, y]) => y
    );

    for (let j = 0; j < layerWithY.length; j++) {
      const [v, y] = layerWithY[j];
      if (g.inDegree(v) === 1) {
        const optPosition = yPos.get(g.getAdjacentIn(v)[0])!;
        if (Math.abs(optPosition - y) > 50) {
          continue;
        }

        if (layerWithY.find(([_, y]) => y === optPosition)) {
          break;
        }

        //find vertex on nextWithY that has the same y as v
        const otherV = nextWithY.find(([_, y]) => y === optPosition);

        let minRightVertLayer = Infinity;
        if (otherV) {
          const rightEdges = g.getIncidentIn(otherV[0]);
          minRightVertLayer = Math.min(minRightVertLayer, ...rightEdges.filter((e) => e.source === v).map((e) => vertBundeling.get(e)!));
        }
        const leftEdges = g.getIncidentOut(v);
        let maxLeftVertLayer = Math.max(...leftEdges.map((e) => vertBundeling.get(e)!));

        if (maxLeftVertLayer < minRightVertLayer) {
          yPos.set(v, optPosition);
        }
      } else if (g.outDegree(v) === 1) {
        const optPosition = yPos.get(g.getAdjacentOut(v)[0])!;
        if (Math.abs(optPosition - y) > 50) {
          continue;
        }

        if (layerWithY.find(([_, y]) => y === optPosition)) {
          break;
        }

        //find vertex on nextWithY that has the same y as v
        const otherV = prevWithY.find(([_, y]) => y === optPosition);

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
