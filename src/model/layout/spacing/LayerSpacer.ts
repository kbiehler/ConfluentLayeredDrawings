import { Vertex } from "@/model/ds/Vertex";

export interface LayerSpacer {
  xPosition(layerOrVertex: number | Vertex): number; //x position of the layer or vertex
  xPositionVertical(layer: number, vertex: number): number; //x position of the vertical layer
}
