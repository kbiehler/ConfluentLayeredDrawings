import { generateLayout } from "./layout/GraphLayoutGenerator";
import { Graph, Edge, BipartiteGraph } from "./ds";
import { Vertex } from "./ds/Vertex";
import { GraphLayout } from "./layout/GraphLayout";
import { RedrawState } from "./redraw/RedrawState";
import { InteractionInfo } from "./renderer/InteractionManager";
import { ConfigDto, mapToGraphLayoutCfg } from "@/cfg/ConfigDtos";
import { loadFromCfg } from "@/input/GraphLoader";
import { VertexId } from "./types";
import { buildImplGraph, buildNbrGraph } from "./redraw/RedrawAlg";

export function draw(cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo] {
  const inputG = loadFromCfg(cfgDto.graphCfg);
  const cfg = mapToGraphLayoutCfg(cfgDto);
  const g = convertToLayoutVertices(inputG);

  let bestLayout: GraphLayout | null = null;
  let bestInteractInfo: InteractionInfo | null = null;
  let bestMetrics: any = null;

  for (let i = 0; i < cfgDto.optimizationCfg.metricTries; i++) {
    const [layout, interactInfo, metrics] = generateLayout(g, cfg);
    if (!bestMetrics || metrics.totalVerticalLayer < bestMetrics.totalVerticalLayer) {
      bestLayout = layout;
      bestInteractInfo = interactInfo;
      bestMetrics = metrics;
    }
  }

  const layout = bestLayout!;
  const interactInfo = bestInteractInfo!;
  return [new RedrawState(g), layout, interactInfo];
}

/**
 * selected vertices + nachbarschaft in g
 * @param g
 * @param selection
 * @returns
 */
export function redrawNbr(redrawState: RedrawState, selection: Set<VertexId>, cfgDto: ConfigDto): GraphLayout {
  const g = redrawState.g;
  const cfg = mapToGraphLayoutCfg(cfgDto);
  const nbrGraph = buildNbrGraph(g, selection);
  const [layout, _] = generateLayout(nbrGraph, cfg);
  return layout;
}

/**
 * selected vertices + all edges and vertices in g that lie on a directed path from a selected vertex
 * @param g
 * @param selection
 * @returns
 */
export function redrawImpl(redrawState: RedrawState, selection: Set<VertexId>, cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo] {
  const g = redrawState.g;
  const cfg = mapToGraphLayoutCfg(cfgDto);
  const newGraph = buildImplGraph(g, selection);
  const [layout, interactInfo] = generateLayout(newGraph, cfg);
  return [new RedrawState(newGraph), layout, interactInfo];
}

function convertToLayoutVertices<V>(g: Graph<V>): Graph {
  if (g instanceof BipartiteGraph) {
    const newGraph = new BipartiteGraph();
    const vToNew = new Map<V, Vertex>();
    g.getVerticesA().forEach((v) => {
      const newV = new Vertex(v);
      newGraph.addVertexA(newV);
      vToNew.set(v, newV);
    });
    g.getVerticesB().forEach((v) => {
      const newV = new Vertex(v);
      newGraph.addVertexB(newV);
      vToNew.set(v, newV);
    });
    g.getEdges().forEach((edge) => {
      newGraph.addEdge(new Edge(vToNew.get(edge.source)!, vToNew.get(edge.target)!));
    });
    return newGraph;
  }

  const newGraph = new Graph();
  const vToNew = new Map<V, Vertex>();
  g.getVertices().forEach((v) => {
    const newV = new Vertex(v);
    newGraph.addVertex(newV);
    vToNew.set(v, newV);
  });
  g.getEdges().forEach((edge) => {
    newGraph.addEdge(new Edge(vToNew.get(edge.source)!, vToNew.get(edge.target)!));
  });
  return newGraph;
}
