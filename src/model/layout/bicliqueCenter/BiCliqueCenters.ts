import { Edge, LayerGraph, convertLayerToBiGraph } from "@/model/ds";
import { biCliqueCover } from "@/model/alg/BiCliqueCover";
import { CliqueCenter, Vertex } from "../../ds/Vertex";

/**
 * creates a new graph with biclique centers
 * @param G
 * @returns
 */
export function addBlicliqueCenters(G: LayerGraph, biCliqueDepth: number): LayerGraph {
  for (let i = 0; i < biCliqueDepth; i++) {
    G = addCenters(G);
  }
  return G;
}

function addCenters(G: LayerGraph) {
  let newGraph = new LayerGraph();
  G.getVertices().forEach((v) => {
    newGraph.addVertexToLayer(v, G.getLayer(v) * 2);
  });

  for (let i = 0; i < G.getLayerCount(); i++) {
    const biGraph = convertLayerToBiGraph(G, i);
    const biCliques = biCliqueCover(biGraph);
    const biCliqueTocenter = new Map<any, Vertex>();
    biCliques.forEach((biclique) => {
      const center = new CliqueCenter();
      biCliqueTocenter.set(biclique, center);
      newGraph.addVertexToLayer(center, i * 2 + 1);
    });
    biCliques.forEach((biclique) => {
      biclique.forEach((v) => {
        const center = biCliqueTocenter.get(biclique);
        if (newGraph.getLayer(v) === i * 2) {
          const e = new Edge<any>(v, center);
          newGraph.addEdge(e);
        } else {
          const e = new Edge<any>(center, v);
          newGraph.addEdge(e);
        }
      });
    });
  }
  return newGraph;
}
