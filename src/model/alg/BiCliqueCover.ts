import { Graph, Edge, BipartiteGraph } from "@/model/ds";
import { rsfColoring } from "./Coloring";

/**
 * Heuristic for BiCliqueCover as described in https://ics.uci.edu/~goodrich/pubs/C-100.pdf, Section 3
 *
 * @param graph
 * @param G
 */
export function biCliqueCover<V>(G: BipartiteGraph<V>) {
  const restrictedColGraph = new Graph<Edge<V>>();
  const edges = G.getEdges();
  edges.forEach((e) => {
    restrictedColGraph.addVertex(e);
  });
  //different colors for edges that induce P_4 or (C_4)^4
  // => different colors for discjoint edges ab and cd; where either ad or bc is NO edge
  edges.forEach((ab) => {
    edges.forEach((cd) => {
      const [a, b, c, d] = [ab.source, ab.target, cd.source, cd.target];
      if (ab == cd || a == c || b == d) {
        return;
      }
      //check if edge ad exists (if not, then different color => edge in restrictedColGraph)
      if (!G.getIncidentOut(a).find((e) => e.target == d)) {
        restrictedColGraph.addEdge(new Edge(ab, cd));
      }
      //check if edge bc exists (if not, then different color => edge in restrictedColGraph)
      if (!G.getIncidentOut(a).find((e) => e.target == d)) {
        restrictedColGraph.addEdge(new Edge(ab, cd));
      }
    });
  });

  //find a coloring in restrictedColGraph
  const coloring = rsfColoring(restrictedColGraph);

  //coloring contains set of edges, the subgraph induced by these edges is a biclique in G
  const bicliques: Set<V>[] = [];
  coloring.forEach((color) => {
    const biclique = new Set<V>();
    color.forEach((edge) => {
      biclique.add(edge.source);
      biclique.add(edge.target);
    });
    bicliques.push(biclique);
  });

  return bicliques;
}
