import { solve } from "yalps";
import { Graph } from "@/model/ds/Graph";

/**
 * LP for vertex aligning/edge straightening
 *
 * usally a quadratic programm, but we solve as ILP without the squared term
 *
 * min sum_{uv in E} |x(v) - x(u)|
 * s.t.
 *
 * x(v) - x(u) >= 1 for all u,v in same layer; u left of v
 * d(v) >= 0
 *
 * @param g
 * @returns ILP solution: Map<vertex -> y(u)>
 */
export function solveLp<V>(g: Graph<V>, layerOrder: V[][]) {
  const model = buildLpModel(g, layerOrder);

  const solution = solve(model);

  const solutionMap = new Map<any, number>();
  solution.variables.forEach((key) => {
    solutionMap.set(key[0], key[1]);
  });

  const yValues = new Map<V, number>();
  g.getVertices().forEach((v) => {
    yValues.set(v, solutionMap.get(v) || 0);
  });
  return yValues;
}

type EPlusMinus = { e: any; sign: "+" | "-" };

function buildLpModel<V>(g: Graph<V>, layerOrder: V[][]) {
  /*
  LP in standard form
  layer3: d,    e
  layer2: b, x, c
  layer1:    a
  example for graph with edges {ab, ac, bd, ce}

  direction: min;

  objective: obj; 
  Each vertex contributes to the objective as inDeg(v) - outDeg(v) * y(v). This is considered in netDeg = inDeg - outDeg.

  For each edge:
  constraints = {
    ab+: { min: 1 },
    ac+: { min: 1 },
    bd+: { min: 1 },
    ce+: { min: 1 },
    ab-: { min: 1 },
    ac-: { min: 1 },
    bd-: { min: 1 },
    ce-: { min: 1 },

    [b, x]: { min: 1 },
    [x, c]: { min: 1 },
    [d, e]: { min: 1 }

  }

  For each node: netDeg = inDeg - outDeg; -1 for constrait outgoing edge; 1 for constraint incoming edge
  variables = {
    ab: {obj: 1, ab+: 1, ab-: 1},
    ac: {obj: 1, ac+: 1, ac-: 1},
    bd: {obj: 1, bd+: 1, bd-: 1},
    ce: {obj: 1, ce+: 1, ce-: 1},

    a: {ab+: 1, ab-: -1, ac+: 1, ac-: -1}
    b: {ab+: -1, ab-: 1, bd+: 1, bd-: -1, [b, x]: -1}
    x: {[b, x]: 1, [x, c]: -1}
    c: {ac+: -1, ac-: 1, ce+: 1, ce-: -1, [x, c]: 1}
    d: {bd+: -1, bd-: 1, [d, e]: -1}
    e: {ce+: -1, ce-: 1, [d, e]: 1}
  }
  */

  const constraints = new Map<any, any>();
  const variables = new Map<any, Map<any, number>>();
  g.getEdges().forEach((e) => {
    variables.set(e, new Map());
  });

  g.getVertices().forEach((e) => {
    variables.set(e, new Map());
  });

  g.getEdges().forEach((e) => {
    const ePlus: EPlusMinus = { e: e, sign: "+" };
    const eMinus: EPlusMinus = { e: e, sign: "-" };
    constraints.set(ePlus, { min: 1 });
    constraints.set(eMinus, { min: 1 });

    variables.get(e.source)!.set(ePlus, 1);
    variables.get(e.source)!.set(eMinus, -1);
    variables.get(e.target)!.set(ePlus, -1);
    variables.get(e.target)!.set(eMinus, 1);

    const varMap = variables.get(e)!;
    varMap.set("obj", 1);
    varMap.set(ePlus, 1);
    varMap.set(eMinus, 1);
  });

  layerOrder.forEach((layer) => {
    for (let i = 0; i < layer.length - 1; i++) {
      const u = layer[i];
      const v = layer[i + 1];
      const uv = { u, v };
      constraints.set(uv, { min: 1 });
      variables.get(u)!.set(uv, -1);
      variables.get(v)!.set(uv, 1);
    }
  });

  const model = {
    direction: "minimize" as const,
    objective: "obj",
    constraints: constraints,
    variables: variables,
  };
  return model;
}
