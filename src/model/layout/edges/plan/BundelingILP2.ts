import { Edge, Graph } from "@/model/ds/Graph";
import { solve } from "yalps";

/**
 * LP for vertical edge bundeling
 *
 * input is the conflict graph, conflicting edges should not be on the same layer!
 *
 * min sum_{uv in E} |x(v) - x(u)|
 * s.t.
 *
 * |x(v) - x(u)| >= 1 for all u,v in Graph
 *
 * @param g
 * @returns ILP solution: Map<edge -> y(u)>
 */
export function solveBundelingLp<V>(g: Graph<V>): Map<V, number> {
  const { model, finalVars } = buildLpModel(g);

  const solution = solve(model);
  console.log(solution);

  const solutionMap = new Map<V, number>();

  solution.variables.forEach((key) => {
    if (finalVars.has(key[0])) {
      solutionMap.set(key[0].data, key[0].info);
    }
  });
  return solutionMap;
}

type Wrapper<T> = { data: T; info: string | number };

function buildLpModel<V>(g: Graph<V>, maxColoringSize = 3) {
  /*
  LP in standard form
  example for graph with edges {ab}

  direction: min;

  objective: obj; 

  For each edge:
  constraints = {
    a+: { min: 1  },
    a-: { max: 1  },
    b+: { min: 1  },
    b-: { max: 1  },
    ab1: { max: 1 },
    ab2: { max: 1 }
    ay1: { max: 0 },
    ay2: { max: 0 },
    by1: { max: 0 },
    by2: { max: 0 },

  }
  For each node: netDeg = inDeg - outDeg; -1 for constrait outgoing edge; 1 for constraint incoming edge
  variables = {
    a1: {a+: 1, a-: 1, ab1: 1, ay1: 1}
    a2: {a+: 1, a-: 1, ab2: 1, ay2: 1}
    b1: {b+: 1, b-: 1, ab1: 1, by1: 1}
    b2: {b+: 1, b-: 1, ab2: 1, by2: 1}
    y1: {obj: 1, ay1: -1, by1: -1}
    y2: {obj: 2, ay2: -1, by2: -1}

  }
  */

  const constraints = new Map<any, any>();
  const variables = new Map<any, Map<any, number>>();

  const plusMap = new Map<any, any>();
  const minusMap = new Map<any, any>();
  const edgeNumberMap = new Map<Edge<V>, Map<number, any>>();
  const vertexNumberYMap = new Map<V, Map<number, any>>();

  //init maps
  g.getVertices().forEach((v) => vertexNumberYMap.set(v, new Map()));

  //init constraints
  g.getVertices().forEach((v) => {
    //+-
    const vPlus: Wrapper<V> = { data: v, info: "+" };
    const vMinus: Wrapper<V> = { data: v, info: "-" };
    plusMap.set(v, vPlus);
    minusMap.set(v, vMinus);
    constraints.set(vPlus, { min: 1 });
    constraints.set(vMinus, { max: 1 });
    //v_y_i
    for (let i = 0; i < maxColoringSize; i++) {
      const v_i: Wrapper<V> = { data: v, info: i.toString() + "y" };
      vertexNumberYMap.get(v)!.set(i, v_i);
      constraints.set(v_i, { max: 0 });
    }
  });

  g.getEdges().forEach((e) => {
    edgeNumberMap.set(e, new Map());
    //x_ic + x_jc <= 1
    for (let i = 0; i < maxColoringSize; i++) {
      const e_i: Wrapper<Edge<V>> = { data: e, info: i.toString() };
      edgeNumberMap.get(e)!.set(i, e_i);
      constraints.set(e_i, { max: 1 });
    }
  });

  //init variables
  //y_i
  for (let i = 0; i < maxColoringSize; i++) {
    const y_i = "y" + i;
    const y_i_map = new Map();
    y_i_map.set("obj", i + 1);
    g.getVertices().forEach((v) => {
      y_i_map.set(vertexNumberYMap.get(v)?.get(i), -1);
    });
    variables.set(y_i, y_i_map);
  }

  const finalVars = new Set<Wrapper<V>>();

  g.getVertices().forEach((v) => {
    for (let i = 0; i < maxColoringSize; i++) {
      const v_i: Wrapper<V> = { data: v, info: i };
      finalVars.add(v_i);
      const v_i_map = new Map();
      v_i_map.set(vertexNumberYMap.get(v)!.get(i), 1);
      v_i_map.set(plusMap.get(v), 1);
      v_i_map.set(minusMap.get(v), 1);
      g.getIncident(v).forEach((e) => {
        v_i_map.set(edgeNumberMap.get(e)!.get(i), 1);
      });
      variables.set(v_i, v_i_map);
    }
  });

  console.log(JSON.stringify(constraints));
  console.log(JSON.stringify(variables));

  const model = {
    direction: "minimize" as const,
    objective: "obj",
    constraints: constraints,
    variables: variables,
    integers: variables.keys(),
  };
  return { model, finalVars };
}
