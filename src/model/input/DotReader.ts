import * as graphlibDot from "graphlib-dot";
import { Graph as G, alg } from "graphlib";
import { Graph, Edge } from "@/model/ds";

export function readDotFile(dotContent: string) {
  const graph = new Graph<string, Edge<string>>();

  // 2. Parse the `.dot` file into a Graph object
  const graphlibGraph: G = graphlibDot.read(dotContent);

  graphlibGraph.nodes().forEach((node) => {
    graph.addVertex(node);
  });

  

  graphlibGraph.edges().forEach((edge) => {
    graph.addEdge(new Edge(edge.v, edge.w));
  });

  const sorted = alg.topsort(graphlibGraph);

  return { graph, sorted };
}
