import * as graphlibDot from "graphlib-dot";
import { Graph as G } from "graphlib";
import { Graph, Edge } from "@/model/ds";

export function parseDotFile(dotContent: string) {
  const graph = new Graph<string>();

  // 2. Parse the `.dot` file into a Graph object
  const graphlibGraph: G = graphlibDot.read(dotContent);

  graphlibGraph.nodes().forEach((node) => {
    graph.addVertex(node);
  });

  graphlibGraph.edges().forEach((edge) => {
    graph.addEdge(new Edge(edge.v, edge.w));
  });

  return graph;
}
