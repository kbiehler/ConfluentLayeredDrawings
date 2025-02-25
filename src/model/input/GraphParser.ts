import { Edge, Graph, LayerGraph } from "../ds";
import { readDotFile } from "./DotReader";
import { Model } from "yalps";
import { solveLp } from "./LP";

export function readGraphFromDot(dotContent: string): LayerGraph<string, Edge<string>> {
  const { graph, sorted } = readDotFile(dotContent);
  return lpLayering(graph);
}

function lpLayering(graph: Graph<string, Edge<string>>) {
  const lpResult = solveLp(graph);
  const layerGraph = new LayerGraph<string, Edge<string>>();

  graph.getVertices().forEach((v) => {
    layerGraph.addVertexToLayer(v, lpResult.get(v) || 0);
  });

  let ignoredEdges = 0;

  graph.getEdges().forEach((edge) => {
    try {
      layerGraph.addEdge(new Edge(edge.source, edge.target));
    } catch (error) {
      ignoredEdges++;
    }
  });
  console.log(`Ignored ${ignoredEdges} edges`);
  return layerGraph;
}

function greedyLayering(sorted: string[], graph: Graph<string, Edge<string>>) {
  const graphToLayer = new Map<string, number>();
  sorted.forEach((node, index) => {
    const minLayer = Math.max(
      -1,
      ...graph
        .getIncident(node)
        .filter((edge) => edge.target === node)
        .map((edge) => graphToLayer.get(edge.source)!)
    );
    graphToLayer.set(node, minLayer + 1);
  });

  const layerGraph = new LayerGraph<string, Edge<string>>();
  graph.getVertices().forEach((v) => {
    layerGraph.addVertexToLayer(v, graphToLayer.get(v)!);
  });

  let ignoredEdges = 0;

  graph.getEdges().forEach((edge) => {
    try {
      layerGraph.addEdge(new Edge(edge.source, edge.target));
    } catch (error) {
      ignoredEdges++;
    }
  });
  console.log(`Ignored ${ignoredEdges} edges`);
  return layerGraph;
}
