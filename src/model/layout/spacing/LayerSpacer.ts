import { LayerGraph } from "@/model/ds";
import { Vertex } from "@/model/ds/Vertex";

export class LayerSpacingCfg {
  minWidth: number = 100;
  minVerticalSpacing: number = 50;
  vertexToFirstVertical: number = 100;
  cliqueCenterToFirstVertical: number = 10;
}

export class DynamicalLayerSpacer {
  g: LayerGraph;
  numVertLayer: number[];
  cliqueCenterLayer: Set<number>;
  layerToX: Map<number, number> = new Map<number, number>();
  verticalToX: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();

  constructor(g: LayerGraph, numVertLayer: number[]) {
    this.g = g;
    this.numVertLayer = numVertLayer;
    this.cliqueCenterLayer = new Set<number>();
    for (let i = 0; i < g.getLayerCount(); i++) {
      if (g.getVerticesInLayer(i).find((v) => v.isCliqueCenter())) {
        this.cliqueCenterLayer.add(i);
      }
    }
    this.computeEvenVertLayerSize();
  }

  computeEvenVertLayerSize() {
    let g = this.g;
    let x = 0;
    let cfg = new LayerSpacingCfg();
    this.layerToX.set(0, x);
    for (let i = 0; i < g.getLayerCount() - 1; i++) {
      this.verticalToX.set(i, new Map<number, number>());
      if (this.cliqueCenterLayer.has(i)) {
        x += cfg.cliqueCenterToFirstVertical;
      } else {
        x += cfg.vertexToFirstVertical;
      }
      for (let j = 0; j < this.numVertLayer[i]; j++) {
        this.verticalToX.get(i)!.set(j, x);
        x += cfg.minVerticalSpacing;
      }
      if (this.cliqueCenterLayer.has(i + 1)) {
        x += cfg.cliqueCenterToFirstVertical;
      } else {
        x += cfg.vertexToFirstVertical;
      }
      this.layerToX.set(i + 1, x);
    }
  }

  xPosition(layerOrVertex: number | Vertex): number {
    let layer;
    if (typeof layerOrVertex === "number") {
      layer = layerOrVertex;
    } else {
      layer = this.g.getLayer(layerOrVertex);
    }
    return this.layerToX.get(layer)!;
  }

  xPositionVertical(layer: number, vertex: number): number {
    return this.verticalToX.get(layer)!.get(vertex)!;
  }
}
