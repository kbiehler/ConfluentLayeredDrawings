import { Edge, Graph } from "@/model/ds";
import { greedyFAS } from "@/model/alg/FAS";
import * as fs from "fs";

type Interval = [number, number];

/**
 * orders vertical layers with a greedy FAS algorithm to minimize crossings
 *
 * @param vertexPositions
 * @param verticalLayers each entry of this list -> set of edges bundled on same layer. The list is ordered
 * @returns
 */
export function verticalLayerOrdering<V, E extends Edge<V>>(vertexPosition: (v: V) => number, verticalLayers: Set<E>[]): Set<E>[] {
  const crossingGraph = new Graph<Set<E>>();
  verticalLayers.forEach((layer, _) => {
    crossingGraph.addVertex(layer);
  });

  for (let i = 0; i < verticalLayers.length; i++) {
    for (let j = i + 1; j < verticalLayers.length; j++) {
      const setA = verticalLayers[i];
      const setB = verticalLayers[j];
      //crossing if A before B / crossing if B before A
      let { crossingsAthenB, crossingsBthenA } = calculateCrossingCounts(setA, setB, vertexPosition);
      addCrossingEdge(crossingsAthenB, crossingsBthenA, crossingGraph, setA, setB);
    }
  }

  const finalOrder = greedyFAS(crossingGraph);
  // try all permutations (exhaustive) to find minimum possible crossings
  const n = verticalLayers.length;
  function permute<T>(arr: T[]): T[][] {
    const res: T[][] = [];
    const a = arr.slice();
    const generate = (k: number) => {
      if (k === a.length) {
        res.push(a.slice());
      } else {
        for (let i = k; i < a.length; i++) {
          [a[k], a[i]] = [a[i], a[k]];
          generate(k + 1);
          [a[k], a[i]] = [a[i], a[k]];
        }
      }
    };
    generate(0);
    return res;
  }

  if (n <= 8) {
    const indices = Array.from({ length: n }, (_, i) => i);
    const perms = permute(indices);
    let minCrossings = Infinity;
    let bestOrderIndices: number[] = [];
    for (const p of perms) {
      const permutedLayers = p.map((idx) => verticalLayers[idx]);
      const c = crossingsOfFinalOrder(vertexPosition, permutedLayers);
      if (c < minCrossings) {
        minCrossings = c;
        bestOrderIndices = p.slice();
      }
    }
    const greedyCrossings = crossingsOfFinalOrder(vertexPosition, finalOrder);
    console.log("minimum crossings possible (exhaustive): " + minCrossings + " for order: " + bestOrderIndices.join(","));
    console.log("greedy crossings: " + greedyCrossings);

    // record result for later analysis: browser -> localStorage, Node -> append file
    try {
      const record = { ts: Date.now(), n, minCrossings, greedyCrossings };
      if (typeof window !== "undefined" && window.localStorage) {
        const key = "verticalLayerOrderingResults";
        const existing = JSON.parse(window.localStorage.getItem(key) || "[]");
        existing.push(record);
        window.localStorage.setItem(key, JSON.stringify(existing));
      } else {
        // Node environment: append newline-delimited JSON
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        fs.appendFileSync("verticalLayerOrdering_results.log", JSON.stringify(record) + "\n");
      }
    } catch (err) {
      // best-effort logging; ignore failures
    }
  } else {
    console.log("skipping exhaustive permutation search (n > 8)");
  }
  console.log("crossings final order:" + crossingsOfFinalOrder(vertexPosition, finalOrder));
  return finalOrder;
}

function crossingsOfFinalOrder<V, E extends Edge<V>>(vertexPosition: (v: V) => number, finalOrder: Set<E>[]) {
  type Item = { startY: number; endY: number; layer: number };
  const items: Item[] = [];

  finalOrder.forEach((set, layerIdx) => {
    for (const e of set) {
      items.push({
        startY: vertexPosition(e.source)!,
        endY: vertexPosition(e.target)!,
        layer: layerIdx,
      });
    }
  });

  const keys = new Set<string>();
  const between = (val: number, a: number, b: number) => Math.min(a, b) < val && val < Math.max(a, b);

  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const aStraight = a.startY === a.endY;

    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;
      const b = items[j];

      // a.startY crossing through b
      if (between(a.startY, b.startY, b.endY) && (b.layer < a.layer || aStraight)) {
        keys.add(`${b.layer}:${a.startY}`);
      }

      // a.endY crossing through b
      if (between(a.endY, b.startY, b.endY) && (a.layer < b.layer || aStraight)) {
        keys.add(`${b.layer}:${a.endY}`);
      }
    }
  }

  return keys.size;
}

function addCrossingEdge<V, E extends Edge<V>>(crossingsAthenB: number, crossingsBthenA: number, crossingGraph: Graph<Set<E>>, setA: Set<E>, setB: Set<E>) {
  if (crossingsAthenB < crossingsBthenA) {
    crossingGraph.addEdge(new Edge(setA, setB, crossingsAthenB - crossingsBthenA));
  } else if (crossingsAthenB > crossingsBthenA) {
    crossingGraph.addEdge(new Edge(setB, setA, crossingsBthenA - crossingsAthenB));
  }
}

function calculateCrossingCounts<V, E extends Edge<V>>(setA: Set<E>, setB: Set<E>, vertexPosition: (v: V) => number) {
  const intervalsA: Interval[] = createIntervals(setA, vertexPosition);
  const intervalsB: Interval[] = createIntervals(setB, vertexPosition);
  const sourceVerticesA = createVertexYs(setA, vertexPosition, (edge) => edge.source);
  const targetVerticesA = createVertexYs(setA, vertexPosition, (edge) => edge.target);
  const sourceVerticesB = createVertexYs(setB, vertexPosition, (edge) => edge.source);
  const targetVerticesB = createVertexYs(setB, vertexPosition, (edge) => edge.target);
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
function createVertexYs<V, E extends Edge<V>>(setB: Set<E>, vertexPosition: (v: V) => number, sourceOrTarget: (edge: E) => V) {
  let leftVerticesB = new Set<number>();
  Array.from(setB).forEach((edge) => {
    leftVerticesB.add(vertexPosition(sourceOrTarget(edge))!);
  });
  const leftVerticesBSorted = Array.from(leftVerticesB);
  leftVerticesBSorted.sort((a, b) => a - b);
  return leftVerticesBSorted;
}

function createIntervals<V, E extends Edge<V>>(setA: Set<E>, vertexPosition: (v: V) => number) {
  const intervalsA: Interval[] = [];
  Array.from(setA).forEach((edge) => {
    const sourceY = vertexPosition(edge.source)!;
    const targetY = vertexPosition(edge.target)!;
    const interval: Interval = [Math.min(sourceY, targetY), Math.max(sourceY, targetY)];
    intervalsA.push(interval);
  });
  intervalsA.sort((a, b) => a[0] - b[0]);
  return intervalsA;
}
