import { LayerGraph, Vertex } from "@/model/ds";
import { LayerSpacer } from "./LayerSpacer";
import { VertexSpacer } from "./VertexSpacer";
import _ from "lodash";

export class FixedLayerSpacerCfg {
  layerSpacing: number = 500;
}

export class FixedLayerSpacer implements LayerSpacer {
  g!: LayerGraph;
  numVertLayer!: number[];
  //cache
  layerToX: Map<number, number> = new Map<number, number>();
  verticalToX: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();

  constructor(private cfg: FixedLayerSpacerCfg, private vertexSpacer: VertexSpacer) {}

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
    const centerLayer = this.initCliqueCenters(this.g);
    let g = this.g;
    let cfg = this.cfg;

    let x = 0;
    let i = 0;
    while (i < g.getLayerCount()) {
      this.layerToX.set(i, x);
      let nextNonCenterLayer = this.nextNonCenterLayer(i, centerLayer, g);
      let verticalSpacing = this.computVerticalSpacing(nextNonCenterLayer, i, cfg);

      x += this.vertexSpacer.width(i) / 2;
      for (let j = i; j < nextNonCenterLayer; j++) {
        this.verticalToX.set(j, new Map<number, number>());
        x += verticalSpacing;
        for (let k = 0; k < this.numVertLayer[j]; k++) {
          this.verticalToX.get(j)!.set(k, x);
          x += verticalSpacing;
        }
        this.layerToX.set(j + 1, x);
      }
      x += this.vertexSpacer.width(nextNonCenterLayer) / 2;
      i = nextNonCenterLayer;

      this.layerToX.set(i, x);
    }
  }

  private computVerticalSpacing(nextNonCenterLayer: number, i: number, cfg: FixedLayerSpacerCfg) {
    const num_centers = nextNonCenterLayer - i - 1;
    let freeWidth = cfg.layerSpacing;
    let layerNeeded = _.sum(this.numVertLayer.slice(i, nextNonCenterLayer)) + num_centers + 1;
    let verticalSpacing = freeWidth / layerNeeded;
    return verticalSpacing;
  }

  private nextNonCenterLayer(i: number, cliqueCenterLayer: Set<number>, g: LayerGraph<Vertex, import("/home/kbiehler/Projekte/ConfluentLayeredDrawings/src/model/ds/Graph").Edge<Vertex>>) {
    let nextNonCenterLayer = i + 1;
    while (cliqueCenterLayer.has(nextNonCenterLayer) && nextNonCenterLayer < g.getLayerCount()) {
      nextNonCenterLayer++;
    }
    return nextNonCenterLayer;
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
