import { LayerGraph, Vertex } from "@/model/ds";
import _ from "lodash";

/**
 * https://ics.uci.edu/~goodrich/pubs/C-100.pdf
 *
 * 4.1 Barycenter Method to Place Centers
 *
 * To avoid multiple curves, we place centers of 1..m cliques at the same position as the 1-node
 *
 * @param graph
 * @param vertexPositions
 * @param biCliqueDepth
 * @returns
 */
export function addCliqueCenterPositons(
  graph: LayerGraph, //
  vertexPositions: Map<Vertex, number>,
  biCliqueDepth: number
): Map<Vertex, number> {
  if (biCliqueDepth === 0) {
    return vertexPositions;
  }
  //walk through the center layers
  for (let i = 2 ** (biCliqueDepth - 1); i < graph.getLayerCount(); i += 2 ** biCliqueDepth) {
    computeCenterPositions(graph, vertexPositions, i, 2 ** (biCliqueDepth - 1));
  }
  addCliqueCenterPositons(graph, vertexPositions, biCliqueDepth - 1);
  return vertexPositions;
}

function computeCenterPositions(
  graph: LayerGraph, //
  vertexPositions: Map<Vertex, number>,
  layer: number,
  distToNeighbours: number
) {
  const centerVertices = graph.getVerticesInLayer(layer);
  const vertexToOpt = centerVertices.map((v) => {
    return { v, pos: optPosition(graph, v, vertexPositions, distToNeighbours) };
  });
  assignPositions(vertexToOpt, vertexPositions);
}

function assignPositions(vertexToOpt: { v: Vertex; pos: number }[], vertexPositions: Map<Vertex, number>) {
  const sortedVertexToOpt = _.sortBy(vertexToOpt, (v) => v.pos);
  const j = Math.floor(sortedVertexToOpt.length / 2);

  vertexPositions.set(sortedVertexToOpt[j].v, sortedVertexToOpt[j].pos);
  let lastPos = sortedVertexToOpt[j].pos;

  for (let i = j - 1; i >= 0; i--) {
    let newPos = Math.min(lastPos - 1, sortedVertexToOpt[i].pos);
    vertexPositions.set(sortedVertexToOpt[i].v, newPos);
    lastPos = newPos;
  }

  lastPos = sortedVertexToOpt[j].pos;
  for (let i = j + 1; i < sortedVertexToOpt.length; i++) {
    let newPos = Math.max(lastPos + 1, sortedVertexToOpt[i].pos);
    vertexPositions.set(sortedVertexToOpt[i].v, newPos);
    lastPos = newPos;
  }
}

function optPosition(graph: LayerGraph, v: Vertex, vertexPositions: Map<Vertex, number>, distToNeighbours: number) {
  const upNeighbours = getNeighbours(graph, v, distToNeighbours, "up");
  const downNeighbours = getNeighbours(graph, v, distToNeighbours, "down");
  if (new Set(upNeighbours).size === 1) {
    return vertexPositions.get(upNeighbours[0])!;
  } else if (new Set(downNeighbours).size === 1) {
    return vertexPositions.get(downNeighbours[0])!;
  }
  const neighbors = new Set([...upNeighbours, ...downNeighbours]);
  const pos = Math.floor(_.sum([...neighbors].map((v) => vertexPositions.get(v)!)) / neighbors.size);
  return pos;
}

function getNeighbours(
  graph: LayerGraph, //
  vertex: Vertex,
  distToNeighbours: number,
  direction: "up" | "down"
): Vertex[] {
  if (distToNeighbours === 0) {
    return [vertex];
  }
  const neighbours = direction === "up" ? graph.getAdjacentOut(vertex) : graph.getAdjacentIn(vertex);
  return neighbours.flatMap((v) => getNeighbours(graph, v, distToNeighbours - 1, direction));
}
