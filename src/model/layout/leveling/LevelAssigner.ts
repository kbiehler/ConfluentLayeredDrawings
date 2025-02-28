import { Graph, Edge, LayerGraph } from "@/model/ds";
import { solveLp } from "./LevelingLP";

/**
 * so far only assign layers to minimize total edge length
 */
export function assignLayers<V>(g: Graph<V>) {
  if (g instanceof LayerGraph) {
    return g;
  }
  return lpLayering(g);
}

function lpLayering<V>(graph: Graph<V>) {
  const lpResult = solveLp(graph);

  const layerGraph = new LayerGraph<V>();
  graph.getVertices().forEach((v) => {
    layerGraph.addVertexToLayer(v, lpResult.get(v)!);
  });

  let ignoredEdges = 0;
  graph.getEdges().forEach((edge) => {
    try {
      //toDo add dummy for edges that span more then 1 layer
      layerGraph.addEdge(new Edge(edge.source, edge.target));
    } catch (error) {
      ignoredEdges++;
    }
  });
  console.log(`Ignored ${ignoredEdges} edges`);
  return layerGraph;
}
