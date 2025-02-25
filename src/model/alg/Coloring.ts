import { Graph, Edge } from "@/model/ds/Graph";

/**
 * See https://en.wikipedia.org/wiki/Recursive_largest_first_algorithm
 *
 * runtime probably O(V * E)
 *
 * @param G
 * @returns
 */
export function rlfColoring<V, E extends Edge<V>>(G: Graph<V, E>): Set<V>[] {
  G = G.copy();
  const res: Set<V>[] = [];
  while (G.getVertices().length > 0) {
    const S = new Set<V>(); //next color

    //all vertices not adjacent to S
    const U = new Set<V>(G.getVertices());

    //neighbours of S
    const neighbourS = new Set<V>();

    //first vertex = max degree
    let v = Array.from(U).reduce((a, b) => (G.degree(a) > G.degree(b) ? a : b));
    let hasNext = true;
    while (hasNext) {
      S.add(v);
      U.delete(v);
      G.getAdjacent(v).forEach((u) => {
        U.delete(u);
        neighbourS.add(u);
      });
      hasNext = false;

      /**
       * Choose a vertex of G that
       * (a) is not adjacent to S (= is in U)
       * (b) has a maximal number of neighbors that are adjacent to vertices in S
       */
      let max_potential = -1;
      for (const u of U) {
        const tmp = Array.from(G.getAdjacent(u)).filter((neighbour) => neighbourS.has(neighbour)).length;
        if (tmp > max_potential) {
          hasNext = true;
          max_potential = tmp;
          v = u;
        }
      }
    }
    res.push(S);
    S.forEach((v) => {
      G.getIncident(v).forEach((edge) => {
        G.deleteEdge(edge);
      });
      G.deleteVertex(v);
    });
  }
  return res;
}
