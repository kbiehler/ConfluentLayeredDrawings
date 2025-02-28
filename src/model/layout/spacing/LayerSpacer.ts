import { LayerGraph } from "@/model/ds";
import { Vertex } from "@/model/ds/Vertex";

export class LayerSpacingCfg {
  minWidth: number = 100;
  maxWidh: number = 600;
}

export class DynamicalLayerSpacer {
  g: LayerGraph;

  constructor(g: LayerGraph) {
    this.g = g;
  }

  xPosition(layerOrVertex: number | Vertex): number {
    let layer;
    if (typeof layerOrVertex === "number") {
      layer = layerOrVertex;
    } else {
      layer = this.g.getLayer(layerOrVertex);
    }
    return {
      0: 0,
      1: 300,
      2: 600,
      3: 1000,
      4: 1400,
      5: 1800,
      6: 2200,
    }[layer]!;
  }

  spaceRightOfLayer(layer: number): number {
    return {
      0: 50,
      1: 20,
      2: 50,
      3: 20,
      4: 50,
      5: 20,
    }[layer]!;
  }

  spaceLeftOfLayer(layer: number): number {
    return {
      1: 20,
      2: 50,
      3: 20,
      4: 50,
      5: 20,
      6: 50,
    }[layer]!;
  }
}
