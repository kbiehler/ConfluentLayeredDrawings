import { LayerGraph } from "@/model/ds";
import { Vertex } from "@/model/ds/Vertex";
import { LayerSpacer } from "./LayerSpacer";
import { CliqueCenterVertexSpacer } from "./VertexSpacer";

export class EvenVerticalWidthSpacerCfg {
  minWidth: number = 100;
  minVerticalSpacing: number = 30;
  vertexToFirstVertical: number = 100;
  cliqueCenterToFirstVertical: number = 20;
}

export class EvenVerticalWidthSpacer implements LayerSpacer {
  cfg: EvenVerticalWidthSpacerCfg;
  g!: LayerGraph;
  numVertLayer!: number[];
  //cache
  layerToX: Map<number, number> = new Map<number, number>();
  verticalToX: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
  vertexSpacer: CliqueCenterVertexSpacer;

  constructor(cfg = new EvenVerticalWidthSpacerCfg(), vertexSpacer = new CliqueCenterVertexSpacer()) {
    this.cfg = cfg;
    this.vertexSpacer = vertexSpacer;
  }

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
    let x = 0;
    let cfg = new EvenVerticalWidthSpacerCfg();
    this.layerToX.set(0, x);
    for (let i = 0; i < g.getLayerCount() - 1; i++) {
      this.verticalToX.set(i, new Map<number, number>());
      x += this.vertexSpacer.width(i) / 2;
      if (cliqueCenterLayer.has(i)) {
        x += cfg.cliqueCenterToFirstVertical;
      } else {
        x += cfg.vertexToFirstVertical;
      }
      for (let j = 0; j < this.numVertLayer[i]; j++) {
        this.verticalToX.get(i)!.set(j, x);
        x += cfg.minVerticalSpacing;
      }
      if (cliqueCenterLayer.has(i + 1)) {
        x += cfg.cliqueCenterToFirstVertical;
      } else {
        x += cfg.vertexToFirstVertical;
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
