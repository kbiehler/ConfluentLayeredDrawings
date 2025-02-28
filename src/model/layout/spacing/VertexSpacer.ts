export interface VertexSpacer {
  width(layer: number): number;
}

export class SimpleVertexSpacer implements VertexSpacer {
  width(layer: number): number {
    return 150;
  }
}

export class CliqueCenterVertexSpacer implements VertexSpacer {
  width(layer: number): number {
    return layer % 2 == 0 ? 200 : 10;
  }
}

export class DynamicalLayerSpacer implements VertexSpacer {
  width(layer: number): number {
    return 150;
  }
}
