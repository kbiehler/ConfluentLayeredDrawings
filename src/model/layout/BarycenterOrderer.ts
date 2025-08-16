import { LayerGraph } from "@/model/ds/LayerGraph";
import _ from "lodash";
import { findComponents } from "../alg/Components";

export class BarycenterOrderer {
  depth: number;
  initRandom: boolean;
  identConnected: boolean;

  constructor(depth: number, randomStart: boolean, identConnected = true) {
    this.depth = depth;
    this.initRandom = randomStart;
    this.identConnected = identConnected;
  }

  public barycenterOrdering<V>(layeredGraph: LayerGraph<V>): V[][] {
    const layout: V[][] = [];
    for (let i = 0; i < layeredGraph.getLayerCount(); i++) {
      layout.push([]);
    }
    let components;
    if (this.identConnected) {
      components = findComponents(layeredGraph).sort((a, b) => a.size - b.size);
    } else {
      //treat graph as single component
      components = [new Set<V>(layeredGraph.getVertices())];
    }
    for (const component of components) {
      const tmpLayout = this.orderComponent<V>(layeredGraph, component);
      for (let i = 0; i < tmpLayout.length; i++) {
        layout[i].push(...tmpLayout[i]);
      }
    }
    return layout;
  }

  private orderComponent<V>(layeredGraph: LayerGraph<V>, component: Set<V>): V[][] {
    const nLayers = layeredGraph.getLayerCount();
    const layout = this.initLayout(layeredGraph, component);

    let iteration = 0;
    let change = true;
    while (change && iteration < this.depth) {
      const oldLayout = _.cloneDeep(layout);
      //walk up
      for (let layer = 0; layer < nLayers - 1; layer++) {
        this.permute(layeredGraph, layout, layer, layer + 1);
      }
      //walk down
      for (let layer = nLayers - 1; layer > 0; layer--) {
        this.permute(layeredGraph, layout, layer, layer - 1);
      }
      iteration++;

      change = !_.isEqual(oldLayout, layout);
    }

    return layout;
  }

  private permute<V>(layeredGraph: LayerGraph<V>, layout: V[][], iFix: number, iPermute: number) {
    let newLayer = this.computeNewLayer(layeredGraph, layout[iFix], layout[iPermute]);
    layout[iPermute] = newLayer;
  }

  private computeNewLayer<V>(layeredGraph: LayerGraph<V>, fixLayer: V[], changeLayer: V[]): V[] {
    let optimalPositions = new Map<V, number>();
    let fixLayerMap = new Map<V, number>();

    fixLayer.forEach((v, i) => fixLayerMap.set(v, i));

    changeLayer.forEach((v, i) => {
      const adjacent = Array.from(layeredGraph.getAdjacent(v)).filter((v) => fixLayerMap.has(v));
      //maintain current position
      if (adjacent.length == 0) {
        optimalPositions.set(v, i);
      } else {
        const sum = _.sum(adjacent.map((v) => fixLayerMap.get(v)!));
        optimalPositions.set(v, sum / adjacent.length);
      }
    });
    const newLayer = _.sortBy(_.shuffle(changeLayer), [(v: V) => optimalPositions.get(v)]);
    return newLayer;
  }

  /*
  inits an inital layout for the barycenter, containing only vertices of verticesConsider 
  random if barycenterRandomStart is set, otherwise order the layeredGraph returns
  */
  private initLayout<V>(layeredGraph: LayerGraph<V>, verticesConsider: Set<V>): V[][] {
    const layout: V[][] = [];
    for (let layer = 0; layer < layeredGraph.getLayerCount(); layer++) {
      let vertices = Array.from(layeredGraph.getVerticesInLayer(layer).filter((v) => verticesConsider.has(v)));
      if (this.initRandom) {
        vertices = _.shuffle(vertices);
      }
      layout.push(vertices);
    }
    return layout;
  }
}
