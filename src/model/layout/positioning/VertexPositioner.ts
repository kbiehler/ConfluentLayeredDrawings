import { LayerGraph } from "@/model/ds/LayerGraph";
import _ from "lodash";
import { BarycenterOrderer } from "@/model/layout/BarycenterOrderer";
import { positionIterative } from "./PositionIterativ";
import { solveLp } from "./PositionLP";

export enum VertexPositionAlgorithm {
  LP = "LP",
  iterative = "iterative",
}

export class VertexPositionCfg {
  baryDepth: number = 0;
  baryInitRandom: boolean = false;
  baryIdentConnected: boolean = true;
  layerSpacing: number = 600;
  vertexSpacing: number = 100;
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
    } else {
      yPos = positionIterative(layeredGraph, layout);
    }
    return this.computeSpacing(layout, yPos);
  }

  private computeSpacing<V>(layers: V[][], yPos: Map<V, number>): Map<V, number> {
    const ySpacing = this.cfg.vertexSpacing;
    const layerShift = ySpacing / 2;
    const vertexPositions = new Map<V, number>();
    layers.forEach((vertices, i_layer) => {
      vertices.forEach((vertex, _) => {
        let y = yPos.get(vertex)! * ySpacing + (i_layer % 2) * layerShift;
        vertexPositions.set(vertex, y);
      });
    });
    return vertexPositions;
  }
}
