import { Graph, Edge, LayerGraph } from "@/model/ds";
import { solveLp } from "./LevelingLP";

/**
 * so far only assign layers to minimize total edge length
 */
export function assignLayers<V, E extends Edge<V>>(g: Graph<V, E>) {
  if (g instanceof LayerGraph) {
    return g;
  }
  return lpLayering(g);
}

function lpLayering<V>(graph: Graph<V, Edge<V>>) {
  const lpResult = solveLp(graph);

  const layerGraph = new LayerGraph<V, Edge<V>>();
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
