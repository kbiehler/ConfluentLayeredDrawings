import { EdgeLayout, GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import * as d3 from "d3";

export interface RenderCfg {
  vertexColor: string;
  highlightColor: string;
}

export class GraphSVGRenderer {
  render(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, //
    graphLayout: GraphLayout,
    renderCfg: RenderCfg,
    highlightVertex: (vertexId: string) => boolean,
    highlightEdge: (edgeId: string) => boolean
  ) {
    svg
      .selectAll<SVGCircleElement, VertexLayout>("circle")
      .data(graphLayout.getVertices())
      .join("circle")
      .attr("r", 10)
      .attr("cx", (v) => v.position.x)
      .attr("cy", (v) => v.position.y)
      .style("fill", (d: VertexLayout) => (highlightVertex(d.id) ? renderCfg.highlightColor : renderCfg.vertexColor));

    svg
      .selectAll<SVGTextElement, VertexLayout>(".vertex-label")
      .data(graphLayout.getVertices())
      .enter()
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", (d) => d.position.x)
      .attr("y", (d) => d.position.y)
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d) => d.label.substring(0, 15));

    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    svg
      .selectAll<SVGPathElement, EdgeLayout>("path")
      .data(graphLayout.getEdgeDrawings())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: EdgeLayout) => (highlightEdge(d.id) ? "blue" : "#999"))
      .attr("stroke-width", (d: EdgeLayout) => (highlightEdge(d.id) ? 2 : 1))
      .attr("d", (d: EdgeLayout) => {
        return lineGenerator(d.points.map((p) => [p.x, p.y]));
      });
  }
}
