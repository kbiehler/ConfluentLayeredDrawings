import { LayerGraph, Vertex } from "@/model/ds";

/**
 * computes final y-positions for the vertices
 *
 * shifts every second layer by half the yDist if shift is set
 *
 * @param layerGraph
 * @param yPos
 * @param yDist
 * @returns
 */
export function computeScaledPositions(layerGraph: LayerGraph, yPos: Map<Vertex, number>, yDist: number, shift = true): Map<Vertex, number> {
  const yShift = shift ? Math.floor(yDist / 2) : 0;
  const scaledYPos = new Map<Vertex, number>();
  yPos.forEach((pos, vertex) => scaledYPos.set(vertex, pos * yDist + (layerGraph.getLayer(vertex) % 2) * yShift));
  return scaledYPos;
}
