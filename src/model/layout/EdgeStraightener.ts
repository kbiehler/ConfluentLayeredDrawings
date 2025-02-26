import { LayerGraph } from "@/model/ds/LayerGraph";
import _ from "lodash";

/**
 * https://link.springer.com/content/pdf/10.1007/3-540-45848-4_3
 * page 4, Iterative heuristic
 *
 * The method  sweeps up and down the layering.
 * While sweeping down, vertices in each layer are considered in order of non-increasing upper degree.
 *
 * Each vertex is shifted toward the average coordinate of its upper neighbors, but without violating the minimum separation constraint.
 * To increase the available space, lower priority vertices may be shifted together with the current one.
 * The reverse sweep is carried out symmetrically.
 *
 * @param layeredGraph
 * @param layout
 * @returns y-values of each vertex as described. all values are integers, values start at 0
 */
export function straightenEdges<V>(layeredGraph: LayerGraph<V, any>, layout: V[][]): Map<V, number> {
  const nLayers = layeredGraph.getNumLayers();

  const yPos = new Map<V, number>();
  const max_layer_size = Math.max(...layout.map((layer) => layer.length));
  for (let layer = 0; layer < nLayers; layer++) {
    layout[layer].forEach((vertex, position) => {
      yPos.set(vertex, position);
    });
  }

  for (let i = 0; i < 50; i++) {
    for (let layer = nLayers - 2; layer >= 0; layer--) {
      const fixed = new Set<V>();
      let layerChange = layout[layer];
      if (layerChange.length === max_layer_size) {
        continue;
      }
      let processOrder = _.orderBy(layerChange, (v) => layeredGraph.outDegree(v), "desc");
      processOrder.forEach((v) => {
        if (layeredGraph.outDegree(v) > 0) {
          //otherwise dont change anything
          let currentPosition = yPos.get(v)!;
          let sum = _.sum(layeredGraph.getIncidentDirected(v).map((e) => yPos.get(e.target)!));
          let optimalPosition = Math.round(sum / layeredGraph.outDegree(v));
          if (currentPosition > optimalPosition) {
            shiftUp(layerChange, v, fixed, yPos, optimalPosition);
          } else if (currentPosition < optimalPosition) {
            shiftDown(layerChange, v, fixed, yPos, optimalPosition);
          }
        }
        fixed.add(v);
      });
    }

    for (let layer = 1; layer < nLayers; layer++) {
      const fixed = new Set<V>();
      let layerChange = layout[layer];
      if (layerChange.length === max_layer_size) {
        continue;
      }
      let processOrder = _.orderBy(layerChange, (v) => layeredGraph.inDegree(v), "desc");
      processOrder.forEach((v) => {
        if (layeredGraph.inDegree(v) > 0) {
          //otherwise dont change anything
          let currentPosition = yPos.get(v)!;
          let sum = _.sum(layeredGraph.getIngoing(v).map((e) => yPos.get(e.source)!));
          let optimalPosition = Math.round(sum / layeredGraph.inDegree(v));
          if (currentPosition > optimalPosition) {
            shiftUp(layerChange, v, fixed, yPos, optimalPosition);
          } else if (currentPosition < optimalPosition) {
            shiftDown(layerChange, v, fixed, yPos, optimalPosition);
          }
        }
        fixed.add(v);
      });
    }
  }

  const y_min = Math.min(...Array.from(yPos.values()));
  yPos.forEach((value, key) => {
    yPos.set(key, value - y_min);
  });

  return yPos;
}

function shiftUp<V>(layerChange: V[], v: V, fixed: Set<V>, yPos: Map<V, number>, optimalPosition: number) {
  let currIndex = layerChange.indexOf(v);
  let minShiftPos = furthestAllowedShiftPosition(currIndex, fixed, layerChange, yPos, true);

  let newVPos = Math.max(minShiftPos, optimalPosition);
  yPos.set(v, newVPos);

  let minRequiredPos = newVPos - 1;
  let i = currIndex - 1;
  while (i >= 0) {
    const currShift = layerChange[i];
    if (minRequiredPos >= yPos.get(currShift)!) {
      //vertex must not be shifed, thus all behind must not be shifted
      break;
    }
    yPos.set(currShift, minRequiredPos);
    minRequiredPos--;
    i--;
  }
}

function shiftDown<V>(layerChange: V[], v: V, fixed: Set<V>, yPos: Map<V, number>, optimalPosition: number) {
  let currIndex = layerChange.indexOf(v);
  let minShiftPos = furthestAllowedShiftPosition(currIndex, fixed, layerChange, yPos, false);

  let newVPos = Math.min(minShiftPos, optimalPosition);
  yPos.set(v, newVPos);

  let minRequiredPos = newVPos + 1;
  let i = currIndex + 1;
  while (i < layerChange.length) {
    const currShift = layerChange[i];
    if (minRequiredPos <= yPos.get(currShift)!) {
      //vertex must not be shifed, thus all behind must not be shifted
      break;
    }
    yPos.set(currShift, minRequiredPos);
    minRequiredPos++;
    i++;
  }
}

/**
 * furthest position to which the vertex at currIndex can be shifted without violating the fixed vertices
 * (vertices between currIndex and the fixed vertex are considered)
 *
 * @param currIndex
 * @param fixed
 * @param layerChange
 * @param yPos
 * @returns
 */
function furthestAllowedShiftPosition<V>(currIndex: number, fixed: Set<V>, layerChange: V[], yPos: Map<V, number>, shiftUp: boolean) {
  const nextFixed = nextFixedIndex(currIndex, fixed, layerChange, shiftUp);
  if (nextFixed === -1 || nextFixed === layerChange.length) {
    return shiftUp ? -Infinity : Infinity;
  }
  const verticesBetween = Math.abs(currIndex - nextFixed) - 1;
  if (shiftUp) {
    return yPos.get(layerChange[nextFixed])! + 1 + verticesBetween;
  } else {
    return yPos.get(layerChange[nextFixed])! - 1 - verticesBetween;
  }
}

function nextFixedIndex<V>(startIndex: number, fixed: Set<V>, layer: V[], shiftUp: boolean) {
  let i = startIndex + (shiftUp ? -1 : 1);
  while (0 <= i && i < layer.length) {
    if (fixed.has(layer[i])) {
      return i;
    }
    i += shiftUp ? -1 : 1;
  }
  return -1;
}
