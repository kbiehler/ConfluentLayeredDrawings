import { LayerGraph } from "@/model/ds/LayerGraph";
import _ from "lodash";
import { Point2d } from "../types/Point";
import { BarycenterOrderer } from "./BarycenterOrderer";

export class VertexPositionCfg {
  barycenterDepth: number = 0;
  barycenterRandomStart: boolean = false;
  layerSpacing: number = 400;
  vertexSpacing: number = 100;
}

export class VertexPositioner {
  cfg: VertexPositionCfg;

  constructor(cfg: VertexPositionCfg) {
    this.cfg = cfg;
  }

  public computePositions<V>(layeredGraph: LayerGraph<V, any>): Map<V, Point2d> {
    const baryOrderer = new BarycenterOrderer({ barycenterDepth: this.cfg.barycenterDepth, barycenterRandomStart: this.cfg.barycenterRandomStart });
    const layout = baryOrderer.barycenterOrdering(layeredGraph);
    return this.computeSpacing(layout);
  }

  private computeSpacing<V>(layers: V[][]): Map<V, { x: number; y: number }> {
    const xSpacing = this.cfg.layerSpacing;
    const ySpacing = this.cfg.vertexSpacing;
    const layerShift = ySpacing / 2;

    const vertexPositions = new Map<V, { x: number; y: number }>();
    layers.forEach((vertices, i_layer) => {
      vertices.forEach((vertex, position) => {
        let x = i_layer * xSpacing;
        let y = position * ySpacing + (i_layer % 2) * layerShift;
        vertexPositions.set(vertex, { x, y });
      });
    });
    return vertexPositions;
  }
}
