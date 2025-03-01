import { Vertex } from "@/model/ds";

export interface VertexSpacer {
  width(layer: number): number;
  height(layer: number): number;
  label(v: Vertex): string;
}

// export class SimpleVertexSpacer implements VertexSpacer {
//   width(layer: number): number {
//     return 150;
//   }
// }

export class CliqueCenterVertexSpacer implements VertexSpacer {
  width(layer: number): number {
    return layer % 2 == 0 ? 300 : 0;
  }

  height(_: number): number {
    return 50;
  }

  label(v: Vertex): string {
    return v.isCliqueCenter() ? "" : v.getLabel().substring(0, 25);
  }
}

// export class DynamicalLayerSpacer implements VertexSpacer {
//   width(layer: number): number {
//     return 150;
//   }
// }
