import { Graph, Edge, LayerGraph, Vertex, DummyVertex } from "@/model/ds";
import { solveLp } from "./LevelingLP";

/**
 * so far only assign layers to minimize total edge length
 */
export function assignLayers(g: Graph) {
  if (g instanceof LayerGraph) {
    return g;
  }
  return lpLayering(g);
}

function lpLayering(graph: Graph) {
  const lpResult = solveLp(graph);

  const layerGraph = new LayerGraph();
  graph.getVertices().forEach((v) => {
    layerGraph.addVertexToLayer(v, lpResult.get(v)!);
  });

  let ignoredEdges = 0;
  graph.getEdges().forEach((edge) => {
    const sourceLayer = layerGraph.getLayer(edge.source);
    const targetLayer = layerGraph.getLayer(edge.target);
    if (sourceLayer + 1 === targetLayer) {
      layerGraph.addEdge(edge);
    } else {
      console.log(edge.source.label, "->", edge.target.label, "added dummy vertices");
      let prev = edge.source;
      for (let i = sourceLayer + 1; i < targetLayer; i++) {
        let next = new DummyVertex(`dummy vertex ${ignoredEdges++}`);
        layerGraph.addVertexToLayer(next, i);
        layerGraph.addEdge(new Edge(prev, next));
        prev = next;
      }
      layerGraph.addEdge(new Edge(prev, edge.target));
    }
  });
  return layerGraph;
}
