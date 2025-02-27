import { Edge, Graph } from "@/model/ds";
import { Point2d } from "../types/Point";
import { greedyFAS } from "../alg/FAS";

type Interval = [number, number];

/**
 * orders vertical layers with a greedy FAS algorithm to minimize crossings
 *
 * @param vertexPositions
 * @param verticalLayers each entry of this list -> set of edges bundled on same layer. The list is ordered
 * @returns
 */
export function verticalLayerOrdering<V, E extends Edge<V>>(vertexPositions: Map<V, Point2d>, verticalLayers: Set<E>[]): Set<E>[] {
  const crossingGraph = new Graph<Set<E>, any>();
  verticalLayers.forEach((layer, _) => {
    crossingGraph.addVertex(layer);
  });

  for (let i = 0; i < verticalLayers.length; i++) {
    for (let j = i + 1; j < verticalLayers.length; j++) {
      const setA = verticalLayers[i];
      const setB = verticalLayers[j];
      //crossing if A before B / crossing if B before A
      let { crossingsAthenB, crossingsBthenA } = calculateCrossingCounts(setA, setB, vertexPositions);
      addCrossingEdge(crossingsAthenB, crossingsBthenA, crossingGraph, setA, setB);
    }
  }

  const finalOrder = greedyFAS(crossingGraph);
  let totalCrossings = 0;
  for (let i = 0; i < finalOrder.length; i++) {
    for (let j = i + 1; j < finalOrder.length; j++) {
      const setA = finalOrder[i];
      const setB = finalOrder[j];
      //crossing if A before B / crossing if B before A
      totalCrossings += calculateCrossingCounts(setA, setB, vertexPositions).crossingsAthenB;
    }
  }
  console.log(totalCrossings);
  return finalOrder;
}

function addCrossingEdge<V, E extends Edge<V>>(crossingsAthenB: number, crossingsBthenA: number, crossingGraph: Graph<Set<E>, any>, setA: Set<E>, setB: Set<E>) {
  if (crossingsAthenB < crossingsBthenA) {
    crossingGraph.addEdge(new Edge(setA, setB, crossingsAthenB - crossingsBthenA));
  } else if (crossingsAthenB > crossingsBthenA) {
    crossingGraph.addEdge(new Edge(setB, setA, crossingsBthenA - crossingsAthenB));
  }
}

function calculateCrossingCounts<V, E extends Edge<V>>(setA: Set<E>, setB: Set<E>, vertexPositions: Map<V, Point2d>) {
  const intervalsA: Interval[] = createIntervals(setA, vertexPositions);
  const intervalsB: Interval[] = createIntervals(setB, vertexPositions);
  const sourceVerticesA = createVertexYs(setA, vertexPositions, (edge) => edge.source);
  const targetVerticesA = createVertexYs(setA, vertexPositions, (edge) => edge.target);
  const sourceVerticesB = createVertexYs(setB, vertexPositions, (edge) => edge.source);
  const targetVerticesB = createVertexYs(setB, vertexPositions, (edge) => edge.target);
  const crossingsAthenB = calcCrossings(sourceVerticesB, intervalsA) + calcCrossings(targetVerticesA, intervalsB);
  const crossingsBthenA = calcCrossings(sourceVerticesA, intervalsB) + calcCrossings(targetVerticesB, intervalsA);
  return { crossingsAthenB, crossingsBthenA };
}

function calcCrossings(vertices: number[], intervals: Interval[]) {
  let colissions = 0;
  let intervalIndex = 0;
  for (const x of vertices) {
    while (intervalIndex < intervals.length && intervals[intervalIndex][1] < x) {
      intervalIndex++;
    }
    if (intervalIndex < intervals.length && intervals[intervalIndex][0] < x && x < intervals[intervalIndex][1]) {
      colissions++;
    }
  }
  return colissions;
}

/**
 *
 * @param setB
 * @param vertexPositions
 * @param sourceOrTarget
 * @returns distinct sorted y values of the sourceOrTarget vertex of the edges
 */
function createVertexYs<V, E extends Edge<V>>(setB: Set<E>, vertexPositions: Map<V, Point2d>, sourceOrTarget: (edge: E) => V) {
  let leftVerticesB = new Set<number>();
  Array.from(setB).forEach((edge) => {
    leftVerticesB.add(vertexPositions.get(sourceOrTarget(edge))!.y);
  });
  const leftVerticesBSorted = Array.from(leftVerticesB);
  leftVerticesBSorted.sort((a, b) => a - b);
  return leftVerticesBSorted;
}

function createIntervals<V, E extends Edge<V>>(setA: Set<E>, vertexPositions: Map<V, Point2d>) {
  const intervalsA: Interval[] = [];
  Array.from(setA).forEach((edge) => {
    const sourceY = vertexPositions.get(edge.source)!.y;
    const targetY = vertexPositions.get(edge.target)!.y;
    const interval: Interval = [Math.min(sourceY, targetY), Math.max(sourceY, targetY)];
    intervalsA.push(interval);
  });
  intervalsA.sort((a, b) => a[0] - b[0]);
  return intervalsA;
}
