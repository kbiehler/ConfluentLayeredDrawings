import { BipartiteGraph, Edge } from "@/model/ds";

export enum ExampleGraphs {
  GRAPH_1 = "graph1",
  GRAPH_2 = "graph2",
  GRAPH_3 = "graph3",
  GRAPH_4 = "graph4",
  GRAPH_5 = "graph5",
  GRAPH_6 = "graph6",
  GRAPH_7 = "graph7",
  GRAPH_8 = "graph8",
  GRAPH_9 = "graph9",
  GRAPH_10 = "graph10",
  GRAPH_11 = "graph11",
  GRAPH_12 = "graph12",
  GRAPH_13 = "graph13",
  GRAPH_14 = "graph14",
  GRAPH_15 = "graph15",
  GRAPH_16 = "graph16",
  GRAPH_17 = "graph17",
  POS_1 = "positioning1",
  POS_2 = "positioning2",
  POS_3 = "positioning3",
  POS_4 = "positioning4",
  CENTER_1 = "center1",
  CENTER_2 = "center2",
  POST_1 = "post1",
  SUB_1 = "sub1",
  EPP_1 = "epp1",
  EPP_2 = "epp2",
}

/**
 * Generates an example graph based on the provided id.
 * @param {string} id - The identifier of the graph to generate.
 * @returns {BiGraph} - The generated bipartite graph.
 * @throws {Error} - If the graph id is unknown.
 */
export function generateExampleGraph(id: string): BipartiteGraph<Number, Edge<Number>> {
  const graphMap: { [key: string]: () => BipartiteGraph<Number, Edge<Number>> } = {
    graph1: () =>
      createGraph(7, 6, [
        [0, 0],
        [0, 3],
        [1, 2],
        [2, 1],
        [3, 3],
        [3, 5],
        [4, 0],
        [5, 3],
        [6, 4],
        [6, 5],
      ]),
    graph2: () =>
      createGraph(3, 3, [
        [0, 1],
        [1, 2],
      ]),
    graph3: () =>
      createGraph(2, 2, [
        [0, 1],
        [1, 0],
      ]),
    graph4: () =>
      createGraph(3, 3, [
        [0, 1],
        [1, 2],
      ]),
    graph5: () =>
      createGraph(4, 3, [
        [3, 1],
        [2, 0],
      ]),
    graph6: () =>
      createGraph(2, 3, [
        [0, 1],
        [0, 2],
      ]),
    graph7: () =>
      createGraph(4, 4, [
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3],
      ]),
    graph8: () =>
      createGraph(4, 4, [
        [0, 0],
        [0, 1],
        [2, 2],
        [2, 3],
      ]),
    graph9: () =>
      createGraph(4, 4, [
        [0, 2],
        [1, 2],
        [2, 3],
        [3, 3],
      ]),
    graph10: () =>
      createGraph(2, 3, [
        [0, 1],
        [1, 1],
        [1, 2],
      ]),
    graph11: () =>
      createGraph(5, 5, [
        [0, 1],
        [0, 2],
        [0, 4],
        [2, 3],
        [2, 0],
      ]),
    graph12: () =>
      createGraph(5, 5, [
        [0, 1],
        [0, 2],
        [2, 3],
        [2, 0],
        [4, 4],
        [4, 3],
      ]),
    graph13: () =>
      createGraph(6, 6, [
        [0, 0],
        [1, 1],
        [2, 2],
        [2, 3],
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 4],
        [5, 4],
      ]),
    graph14: () =>
      createGraph(4, 4, [
        [0, 0],
        [1, 1],
        [2, 2],
        [0, 3],
        [1, 3],
        [2, 3],
      ]),
    graph15: () =>
      createGraph(4, 4, [
        [0, 2],
        [1, 2],
        [1, 3],
      ]),
    graph16: () =>
      createGraph(4, 4, [
        [0, 1],
        [0, 3],
        [2, 1],
      ]),
    graph17: () =>
      createGraph(4, 4, [
        [0, 0],
        [1, 0],
        [1, 1],
      ]),
    positioning1: () =>
      createGraph(6, 2, [
        [4, 0],
        [5, 0],
        [5, 1],
      ]),
    positioning2: () =>
      createGraph(6, 2, [
        [4, 0],
        [4, 1],
        [5, 0],
      ]),
    positioning3: () =>
      createGraph(3, 6, [
        [0, 5],
        [2, 3],
        [2, 5],
      ]),
    positioning4: () =>
      createGraph(6, 6, [
        [0, 5],
        [2, 0],
        [2, 1],
        [4, 2],
        [5, 2],
      ]),
    center1: () =>
      createGraph(4, 4, [
        [1, 3],
        [2, 0],
      ]),
    center2: () =>
      createGraph(4, 4, [
        [0, 2],
        [0, 3],
      ]),
    post1: () =>
      createGraph(4, 4, [
        [0, 1],
        [0, 2],
        [0, 3],
        [2, 1],
      ]),
    sub1: () =>
      createGraph(5, 5, [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
        [3, 2],
        [3, 3],
        [3, 4],
        [4, 3],
        [4, 4],
      ]),
    epp1: () =>
      createGraph(7, 6, [
        [0, 0],
        [0, 3],
        [1, 2],
        [2, 1],
        [3, 3],
        [3, 5],
        [4, 0],
        [5, 3],
        [6, 4],
        [6, 5],
      ]),
    epp2: () =>
      createGraph(7, 8, [
        [0, 0],
        [0, 1],
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 7],
        [2, 1],
        [2, 3],
        [2, 5],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 5],
        [3, 6],
        [3, 7],
        [4, 0],
        [4, 1],
        [4, 3],
        [4, 4],
        [5, 5],
        [5, 6],
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 6],
        [6, 7],
      ]),
  };

  if (graphMap[id]) {
    return graphMap[id]();
  } else {
    throw new Error(`Unknown graph id: ${id}`);
  }
}

/**
 * Creates a bipartite graph with the specified vertices and edges.
 * @param {number} verticesA - Number of vertices in layer A.
 * @param {number} verticesB - Number of vertices in layer B.
 * @param {[number, number][]} edges - Array of edges connecting vertices.
 * @returns {BiGraph} - The created bipartite graph.
 */
function createGraph(verticesA: number, verticesB: number, edges: [number, number][]): BipartiteGraph<Number, Edge<Number>> {
  const biGraph = new BipartiteGraph<Number, Edge<Number>>();
  Array.from({ length: verticesA }, (_, i) => biGraph.addVertexA(i));
  Array.from({ length: verticesB }, (_, i) => biGraph.addVertexB(i + verticesA));

  for (const [sourceIndex, targetIndex] of edges) {
    biGraph.addEdge(new Edge(sourceIndex, targetIndex + verticesA));
  }

  return biGraph;
}
