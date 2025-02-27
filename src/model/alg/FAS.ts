import { Graph } from "@/model/ds";

export function greedyFAS<V>(g: Graph<V, any>) {
  let s1: V[] = [];
  let s2: V[] = [];

  while (g.getVertices().length > 0) {
    let sink = findSink(g);
    while (sink) {
      s2.unshift(sink);
      deleteVertex(g, sink);
      sink = findSink(g);
    }

    let source = findSource(g);
    while (source) {
      s1.push(source);
      deleteVertex(g, source);
      source = findSource(g);
    }

    let v = maxNetWeightDegree(g);
    if (v) {
      s1.push(v);
      deleteVertex(g, v);
    }
  }
  return s1.concat(s2);
}

function deleteVertex<V>(g: Graph<V, any>, sink: NonNullable<V>) {
  g.getIncident(sink).forEach((e) => g.deleteEdge(e));
  g.deleteVertex(sink);
}

function findSink<V>(g: Graph<V, any>) {
  return g.getVertices().find((v) => g.getIncidentOut(v).length === 0);
}

function findSource<V>(g: Graph<V, any>) {
  return g.getVertices().find((v) => g.getIncident(v).length === g.getIncidentOut(v).length);
}

/**
 * vertex with maximal (out_weight - in_weight)
 *
 * @param g
 * @returns
 */
function maxNetWeightDegree<V>(g: Graph<V, any>): V | undefined {
  let v = undefined;
  let maxDiff = -Infinity;
  g.getVertices().forEach((vertex) => {
    const diff = netWeightDegree(g, vertex);
    if (diff > maxDiff) {
      v = vertex;
      maxDiff = diff;
    }
  });
  return v;
}

function netWeightDegree<V>(g: Graph<V, any>, v: V) {
  const currentOutWeight = g.getIncidentOut(v).reduce((sum, e) => sum + e.weight, 0);
  const currentFullWeight = g.getIncident(v).reduce((sum, e) => sum + e.weight, 0);
  const currentInWeight = currentFullWeight - currentOutWeight;
  const diffWeight = currentOutWeight - currentInWeight;
  return diffWeight;
}
