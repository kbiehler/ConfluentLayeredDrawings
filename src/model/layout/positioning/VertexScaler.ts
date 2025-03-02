import { LayerGraph, Vertex } from "@/model/ds";

export function computeScaledPositions(layerGraph: LayerGraph, yPos: Map<Vertex, number>, yDist: number): Map<Vertex, number> {
  const shift = Math.floor(yDist / 2);
  const scaledYPos = new Map<Vertex, number>();
  // yPos.forEach((pos, vertex) => scaledYPos.set(vertex, pos * yDist));
  yPos.forEach((pos, vertex) => scaledYPos.set(vertex, pos * yDist + (layerGraph.getLayer(vertex) % 2) * shift));
  return scaledYPos;
}
