import { LayerGraph } from "@/model/ds/LayerGraph";

export class VertexPositionCfg {
  barycenterDepth: number = 0;
  barycenterRandomStart: boolean = false;
  layerSpacing: number = 400;
  vertexSpacing: number = 100;
  layerShift: number = 50;
}

export class VertexPositioner {
  cfg: VertexPositionCfg;

  constructor(cfg: VertexPositionCfg) {
    this.cfg = cfg;
  }

  public barycenterPositions<V>(layeredGraph: LayerGraph<V, any>): Map<V, { x: number; y: number }> {
    const nLayers = layeredGraph.getNumLayers();
    const layout = this.initLayout(layeredGraph);

    // barycenter
    let iteration = 0;
    while (iteration < this.cfg.barycenterDepth) {
      let directionUp = iteration % 2 == 0;
      for (let layer = 1; layer < nLayers; layer++) {
        let layerIndexChange = directionUp ? layer : nLayers - 1 - layer;
        let layerIndexFix = directionUp ? layer - 1 : nLayers - layer;
        let changeLayer = layout[layerIndexChange];
        let fixLayer = layout[layerIndexFix];
        this.computeBarcenterPositions(layeredGraph, fixLayer, changeLayer);
      }
      iteration++;
    }

    const minValue = Math.min(...layout.flatMap((layer) => Array.from(layer.values())));
    layout.forEach((layer) => {
      layer.forEach((position, vertex) => {
        layer.set(vertex, position - minValue);
      });
    });
    return this.computeSpacing(layout);
  }

  private computeBarcenterPositions<V>(layeredGraph: LayerGraph<V, any>, fixLayer: Map<V, number>, changeLayer: Map<V, number>) {
    let optimalPositions = new Map<V, number>();
    let freeVertices = new Set<V>();

    changeLayer.forEach((_, vertex) => {
      const adjacent = Array.from(layeredGraph.getAdjacent(vertex)).filter((v) => fixLayer?.has(v));
      if (adjacent.length == 0) {
        freeVertices.add(vertex);
      } else {
        const sum = adjacent.reduce((acc, v) => acc + (fixLayer?.get(v) || 0), 0);
        optimalPositions.set(vertex, sum / adjacent.length);
      }
    });

    const sortedVertices = Array.from(optimalPositions.entries()).sort((a, b) => a[1] - b[1]);
    const middle = Math.floor(sortedVertices.length / 2);
    const middleX = Math.round(sortedVertices[middle][1]);
    changeLayer.set(sortedVertices[middle][0], middleX);

    let tmpX = middleX;
    for (let i = middle - 1; i >= 0; i--) {
      tmpX -= 1;
      const optX = Math.round(sortedVertices[i][1]);
      while (freeVertices.size > 0 && tmpX > optX) {
        const freeVertex = freeVertices.values().next().value!;
        freeVertices.delete(freeVertex);
        changeLayer.set(freeVertex, tmpX);
        tmpX -= 1;
      }
      tmpX = Math.min(tmpX, optX);
      const vertex = sortedVertices[i][0];
      changeLayer.set(vertex, tmpX);
    }

    tmpX = middleX;
    for (let i = middle + 1; i < sortedVertices.length; i++) {
      tmpX += 1;
      const optX = Math.round(sortedVertices[i][1]);
      while (freeVertices.size > 0 && tmpX > optX) {
        const freeVertex = freeVertices.values().next().value!;
        freeVertices.delete(freeVertex);
        changeLayer.set(freeVertex, tmpX);
        tmpX += 1;
      }
      tmpX = Math.max(tmpX, optX);
      const vertex = sortedVertices[i][0];
      changeLayer.set(vertex, tmpX);
    }

    freeVertices.forEach((vertex) => {
      tmpX += 1;
      changeLayer.set(vertex, tmpX);
    });
  }

  /*
  inits an inital layout for the barycenter, 
  either random order or the order of the vertices in the layer
  assigne each vertex an index from 0..n-1
  */
  private initLayout<V>(layeredGraph: LayerGraph<V, any>): Map<V, number>[] {
    const layout: Map<V, number>[] = [];

    for (let layer = 0; layer < layeredGraph.getNumLayers(); layer++) {
      const vertices = Array.from(layeredGraph.getVerticesInLayer(layer));

      if (this.cfg.barycenterRandomStart) {
        vertices.sort(() => Math.random() - 0.5);
      }
      const vertexToPosition = new Map();
      vertices.forEach((v, i) => {
        vertexToPosition.set(v, i);
      });
      layout.push(vertexToPosition);
    }

    return layout;
  }


  private computeSpacing<V>(layers: Map<V, number>[]): Map<V, { x: number; y: number }> {
    const xSpacing = this.cfg.layerSpacing;
    const ySpacing = this.cfg.vertexSpacing;
    const layerShift = this.cfg.layerShift;

    const vertexPositions = new Map<V, { x: number; y: number }>();
    layers.forEach((vertices, i_layer) => {
      vertices.forEach((position, vertex) => {
        let x = i_layer * xSpacing;
        let y = position * ySpacing + i_layer * layerShift;
        vertexPositions.set(vertex, { x, y });
      });
    });
    return vertexPositions;
  }

}
