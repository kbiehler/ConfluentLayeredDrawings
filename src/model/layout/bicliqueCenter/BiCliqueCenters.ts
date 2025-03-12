import { Edge, LayerGraph, convertLayerToBiGraph } from "@/model/ds";
import { biCliqueCover } from "@/model/alg/BiCliqueCover";
import { CliqueCenter, Vertex } from "../../ds/Vertex";
import { computeCenterPositions } from "./CliqueCenterPositioner";

/**
 * creates a new graph with biclique centers
 * @param G
 * @returns
 */
export function addBlicliqueCenters(G: LayerGraph, vertexPositions: Map<Vertex, number>): LayerGraph {
  const layers = G.getLayerCount();
  for (let i = 0; i < 2 * (layers - 1); i += 2) {
    G = addCenters(G, i);
    computeCenterPositions(G, vertexPositions, i + 1, 1);
  }

  return G;
}

function addCenters(G: LayerGraph, layer: number) {
  let newGraph = new LayerGraph();
  G.getVertices().forEach((v) => {
    newGraph.addVertexToLayer(v, G.getLayer(v) > layer ? G.getLayer(v) + 1 : G.getLayer(v));
  });
  G.getEdges().forEach((e) => {
    if (G.getLayer(e.source) != layer) {
      newGraph.addEdge(e);
    }
  });

  const biGraph = convertLayerToBiGraph(G, layer);
  const biCliques = biCliqueCover(biGraph);
  const biCliqueTocenter = new Map<any, Vertex>();
  biCliques.forEach((biclique) => {
    const center = new CliqueCenter();
    biCliqueTocenter.set(biclique, center);
    newGraph.addVertexToLayer(center, layer + 1);
  });
  biCliques.forEach((biclique) => {
    biclique.forEach((v) => {
      const center = biCliqueTocenter.get(biclique);
      if (newGraph.getLayer(v) === layer) {
        const e = new Edge<any>(v, center);
        newGraph.addEdge(e);
      } else {
        const e = new Edge<any>(center, v);
        newGraph.addEdge(e);
      }
    });
  });

  return newGraph;
}
