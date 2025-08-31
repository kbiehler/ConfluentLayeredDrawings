import { generateLayout } from "./layout/GraphLayoutGenerator";
import { Graph, Edge, BipartiteGraph } from "./ds";
import { Vertex } from "./ds/Vertex";
import { GraphLayout } from "./layout/GraphLayout";
import { RedrawState } from "./redraw/RedrawState";
import { InteractionInfo } from "./renderer/InteractionManager";
import { ConfigDto, GraphCfgDto, mapToGraphLayoutCfg } from "@/cfg/ConfigDtos";
import { loadFromCfg } from "@/input/GraphLoader";
import { VertexId } from "./types";
import { buildImplGraph, buildNbrGraph } from "./redraw/RedrawAlg";
import { LayoutMetrics } from "./metrics/LayoutMetrics";

export function draw(cfgDto: ConfigDto, graphCfg: GraphCfgDto): [RedrawState, GraphLayout, InteractionInfo, LayoutMetrics, LayoutMetrics] {
  const inputG = loadFromCfg(graphCfg, cfgDto.numberCfg);

  const cfg = mapToGraphLayoutCfg(cfgDto);
  const g = convertToLayoutVertices(inputG);

  let bestLayout: GraphLayout | null = null;
  let bestInteractInfo: InteractionInfo | null = null;
  let bestMetrics: any = null;

  let totalMetrics: LayoutMetrics = {
    totalVerticalLayer: 0,
    ink: 0,
    crossings: 0,
    bends: 0,
  } as LayoutMetrics;

  for (let i = 0; i < cfgDto.optimizationCfg.metricTries; i++) {
    const [layout, interactInfo, metrics] = generateLayout(g, cfg);
    totalMetrics.totalVerticalLayer += metrics.totalVerticalLayer;
    totalMetrics.ink += metrics.ink;
    totalMetrics.crossings += metrics.crossings;
    totalMetrics.bends += metrics.bends;

    if (!bestMetrics || metrics.ink < bestMetrics.ink) {
      bestLayout = layout;
      bestInteractInfo = interactInfo;
      bestMetrics = metrics;
    }
  }

  const avgMetrics: LayoutMetrics = {
    totalVerticalLayer: totalMetrics.totalVerticalLayer / cfgDto.optimizationCfg.metricTries,
    ink: totalMetrics.ink / cfgDto.optimizationCfg.metricTries,
    crossings: totalMetrics.crossings / cfgDto.optimizationCfg.metricTries,
    bends: totalMetrics.bends / cfgDto.optimizationCfg.metricTries,
  } as LayoutMetrics;

  const layout = bestLayout!;
  const interactInfo = bestInteractInfo!;
  const metrics = bestMetrics!;
  return [new RedrawState(g), layout, interactInfo, metrics, avgMetrics];
}

/**
 * selected vertices + nachbarschaft in g
 * @param g
 * @param selection
 * @returns
 */
export function redrawNbr(redrawState: RedrawState, selection: Set<VertexId>, cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo, LayoutMetrics] {
  const g = redrawState.g;
  const cfg = mapToGraphLayoutCfg(cfgDto);
  const nbrGraph = buildNbrGraph(g, selection);
  const [layout, interactInfo, metrics] = generateLayout(nbrGraph, cfg);
  return [new RedrawState(nbrGraph), layout, interactInfo, metrics];
}

/**
 * selected vertices + all edges and vertices in g that lie on a directed path from a selected vertex
 * @param g
 * @param selection
 * @returns
 */
export function redrawImpl(redrawState: RedrawState, selection: Set<VertexId>, cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo, LayoutMetrics] {
  const g = redrawState.g;
  const cfg = mapToGraphLayoutCfg(cfgDto);
  const newGraph = buildImplGraph(g, selection);
  const [layout, interactInfo, metrics] = generateLayout(newGraph, cfg);
  return [new RedrawState(newGraph), layout, interactInfo, metrics];
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
    const newV = v instanceof Vertex ? v.copy() : new Vertex(v);
    newGraph.addVertex(newV);
    vToNew.set(v, newV);
  });
  g.getEdges().forEach((edge) => {
    newGraph.addEdge(new Edge(vToNew.get(edge.source)!, vToNew.get(edge.target)!));
  });
  return newGraph;
}
