import { LayerGraph } from "@/model/ds/LayerGraph";
import _ from "lodash";
import { BarycenterOrderer } from "@/model/layout/BarycenterOrderer";
import { positionIterative } from "./PositionIterativ";
import { solveLp } from "./PositionLP";

export enum VertexPositionAlgorithm {
  LP = "LP",
  iterative = "iterative",
  fixed = "fixed",
}

export class VertexPositionCfg {
  baryDepth: number = 0;
  baryInitRandom: boolean = false;
  baryIdentConnected: boolean = true;
  yDist: number = 100;
  alg: VertexPositionAlgorithm = VertexPositionAlgorithm.LP;
}

export class VertexPositioner {
  cfg: VertexPositionCfg;

  constructor(cfg: VertexPositionCfg) {
    this.cfg = cfg;
  }

  public computePositions<V>(layeredGraph: LayerGraph<V>): Map<V, number> {
    const baryOrderer = new BarycenterOrderer(this.cfg.baryDepth, this.cfg.baryInitRandom, this.cfg.baryIdentConnected);
    const layout = baryOrderer.barycenterOrdering(layeredGraph);

    let yPos;
    if (this.cfg.alg == VertexPositionAlgorithm.LP) {
      yPos = solveLp(layeredGraph, layout);
    } else if (this.cfg.alg == VertexPositionAlgorithm.iterative) {
      yPos = positionIterative(layeredGraph, layout);
    } else {
      yPos = this.computeFixedPositions(layout);
    }
    return yPos;
  }

  private computeFixedPositions<V>(layout: V[][]): any {
    const yPos = new Map<V, number>();
    layout.forEach((layer) => {
      layer.forEach((vertex, j) => {
        yPos.set(vertex, j);
      });
    });
    return yPos;
  }
}
