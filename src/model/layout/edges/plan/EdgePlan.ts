import { Edge } from "@/model/ds";
import { Vertex } from "@/model/ds/Vertex";

export type EdgePlan = {
  edge: Edge<Vertex>;
  layer: number;
  relativeVertLayer: number;
};
