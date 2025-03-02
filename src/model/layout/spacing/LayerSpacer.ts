import { Vertex } from "@/model/ds/Vertex";
import { FixedLayerSpacer, FixedLayerSpacerCfg } from "./FixedLayerSpacer";
import { FixedVerticalSpacer, FixedVerticalSpacerCfg } from "./FixedVerticalSpacer";
import { VertexSpacer } from "./VertexSpacer";

export interface LayerSpacer {
  xPosition(layerOrVertex: number | Vertex): number; //x position of the layer or vertex
  xPositionVertical(layer: number, vertex: number): number; //x position of the vertical layer
  setGraph(g: any): void;
  setNumVertLayer(numVertLayer: number[]): void;
}

export function layerSpacerFromCfg(cfg: FixedVerticalSpacerCfg | FixedLayerSpacerCfg, vertexSpacer: VertexSpacer): LayerSpacer {
  if (cfg instanceof FixedVerticalSpacerCfg) {
    return new FixedVerticalSpacer(cfg, vertexSpacer);
  } else {
    return new FixedLayerSpacer(cfg, vertexSpacer);
  }
}
