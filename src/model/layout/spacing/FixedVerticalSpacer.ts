import { LayerGraph } from "@/model/ds";
import { Vertex } from "@/model/ds/Vertex";
import { LayerSpacer } from "./LayerSpacer";
import { VertexSpacer } from "./VertexSpacer";

export class FixedVerticalSpacerCfg {
  //default values only for testing, default frontend valued set in ConfigDtos.ts
  verticalSpacing: number = 50;
  addVertexDist: number = 50;
  addCenterWidth: number = 50;
}

export class FixedVerticalSpacer implements LayerSpacer {
  g!: LayerGraph;
  numVertLayer!: number[];
  //cache
  layerToX: Map<number, number> = new Map<number, number>();
  verticalToX: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();

  constructor(private cfg: FixedVerticalSpacerCfg, private vertexSpacer: VertexSpacer) {}

  setGraph(g: LayerGraph) {
    //must be set first
    this.g = g;
    this.initCliqueCenters(g);
  }

  setNumVertLayer(numVertLayer: number[]) {
    //must be set second
    this.numVertLayer = numVertLayer;
    this.initValues();
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

  initValues() {
    const cliqueCenterLayer = this.initCliqueCenters(this.g);
    let g = this.g;
    let cfg = this.cfg;
    let x = 0;
    this.layerToX.set(0, x);
    for (let i = 0; i < g.getLayerCount() - 1; i++) {
      this.verticalToX.set(i, new Map<number, number>());
      x += this.vertexSpacer.width(i) / 2;
      if (cliqueCenterLayer.has(i)) {
        x += cfg.addCenterWidth;
      } else {
        x += cfg.addVertexDist;
      }
      for (let j = 0; j < this.numVertLayer[i]; j++) {
        x += cfg.verticalSpacing;
        this.verticalToX.get(i)!.set(j, x);
      }
      x += cfg.verticalSpacing;
      if (cliqueCenterLayer.has(i + 1)) {
        x += cfg.addCenterWidth;
      } else {
        x += cfg.addVertexDist;
      }
      x += this.vertexSpacer.width(i + 1) / 2;
      this.layerToX.set(i + 1, x);
    }
  }

  private initCliqueCenters(g: LayerGraph) {
    const cliqueCenterLayer = new Set<number>();
    for (let i = 0; i < g.getLayerCount(); i++) {
      if (g.getVerticesInLayer(i).find((v) => v.isCliqueCenter())) {
        cliqueCenterLayer.add(i);
      }
    }
    return cliqueCenterLayer;
  }
}
