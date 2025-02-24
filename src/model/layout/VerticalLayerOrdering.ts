import { Edge, Graph } from "@/model/ds";
import { Point2d } from "../types/Point";

export function verticalLayerOrdering<V, E extends Edge<V>>(
  g: Graph<V, E>, //
  vertexPositions: Map<V, Point2d>,
  verticalLayers: Set<E>[]
): Set<E>[] {
  const collisionGraph = new Graph<Number, any>();
  for (let i = 0; i < verticalLayers.length; i++) {
    for (let j = i + 1; j < verticalLayers.length; j++) {
      const setA = verticalLayers[i];
      const setB = verticalLayers[j];
      //colissions if a before b
      
    }
  }

  return verticalLayers;
}
