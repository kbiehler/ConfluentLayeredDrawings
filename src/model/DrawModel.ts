import { generateLayout } from "./layout/GraphLayoutGenerator";
import { Graph, Edge } from "./ds";
import { LayoutVertex } from "./layout/Vertex";
import { GraphLayout } from "./layout/GraphLayout";
import { RedrawState } from "./redraw/RedrawState";
import { InteractionInfo } from "./renderer/InteractionManager";
import { ConfigDto, mapToGraphLayoutCfg } from "@/cfg/ConfigDtos";
import { loadFromCfg } from "@/input/GraphLoader";
import { VertexId } from "./types";

export function draw(cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo] {
  const inputG = loadFromCfg(cfgDto.graphCfg);
  const cfg = mapToGraphLayoutCfg(cfgDto);
  const g = convertToLayoutVertices(inputG);
  const [layout, interactInfo] = generateLayout(g, cfg);
  return [new RedrawState(g), layout, interactInfo];
}

/**
 * selected vertices + nachbarschaft in g
 * @param g
 * @param selection
 * @returns
 */
export function redrawNbr(redrawState: RedrawState, selection: Set<VertexId>, cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo] {
  const g = redrawState.g;
  const idToVertex = new Map<VertexId, LayoutVertex>();
  const cfg = mapToGraphLayoutCfg(cfgDto);
  g.getVertices().forEach((v) => idToVertex.set(v.getId(), v));

  const newGraph = new Graph<LayoutVertex>();
  const addedVertices = new Set<LayoutVertex>();

  selection.forEach((v) => {
    if (!addedVertices.has(idToVertex.get(v)!)) {
      newGraph.addVertex(idToVertex.get(v)!);
      addedVertices.add(idToVertex.get(v)!);
    }
    g.getIncident(idToVertex.get(v)!).forEach((e) => {
      if (!addedVertices.has(e.source)) {
        newGraph.addVertex(e.source);
        addedVertices.add(e.source);
      }
      if (!addedVertices.has(e.target)) {
        newGraph.addVertex(e.target);
        addedVertices.add(e.target);
      }
      newGraph.addEdge(e);
    });
  });
  const [layout, interactInfo] = generateLayout(newGraph, cfg);
  return [new RedrawState(newGraph), layout, interactInfo];
}

/**
 * selected vertices + all edges and vertices in g that lie on a directed path from a selected vertex
 * @param g
 * @param selection
 * @returns
 */
export function redrawImpl(redrawState: RedrawState, selection: Set<VertexId>, cfgDto: ConfigDto): [RedrawState, GraphLayout, InteractionInfo] {
  const g = redrawState.g;
  const idToVertex = new Map<VertexId, LayoutVertex>();
  const cfg = mapToGraphLayoutCfg(cfgDto);
  g.getVertices().forEach((v) => idToVertex.set(v.getId(), v));

  const newGraph = new Graph<LayoutVertex>();
  const q = new Set<LayoutVertex>();
  selection.forEach((v) => {
    q.add(idToVertex.get(v)!);
  });
  const addedVertices = new Set<any>();
  while (q.size > 0) {
    const v = q.values().next().value!;
    q.delete(v);
    if (!addedVertices.has(v)) {
      newGraph.addVertex(v);
      addedVertices.add(v);
    }
    g.getIncidentOut(v).forEach((e) => {
      if (!addedVertices.has(e.target)) {
        newGraph.addVertex(e.target);
        addedVertices.add(e.target);
      }
      q.add(e.target);
      newGraph.addEdge(e);
    });
  }
  const [layout, interactInfo] = generateLayout(newGraph, cfg);
  return [new RedrawState(newGraph), layout, interactInfo];
}

function convertToLayoutVertices<V>(g: Graph<V>): Graph<LayoutVertex> {
  const newGraph = new Graph<LayoutVertex>();
  const vToNew = new Map<V, LayoutVertex>();
  g.getVertices().forEach((v) => {
    const newV = new LayoutVertex(v);
    newGraph.addVertex(newV);
    vToNew.set(v, newV);
  });
  g.getEdges().forEach((edge) => {
    newGraph.addEdge(new Edge(vToNew.get(edge.source)!, vToNew.get(edge.target)!));
  });
  return newGraph;
}
