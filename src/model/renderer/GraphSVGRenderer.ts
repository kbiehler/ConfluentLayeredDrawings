import { EdgeLayout, GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import * as d3 from "d3";

export interface RenderCfg {
  vertexColor: string;
  highlightColor: string;
  edgeColor: string;
}

export class GraphSVGRenderer {
  render(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, //
    graphLayout: GraphLayout,
    renderCfg: RenderCfg,
    highlightVertex: (vertexId: string) => boolean,
    highlightEdge: (edgeId: string) => boolean
  ) {
    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    svg
      .selectAll<SVGPathElement, EdgeLayout>("path")
      .data(graphLayout.getEdgeDrawings())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: EdgeLayout) => (highlightEdge(d.id) ? renderCfg.highlightColor : renderCfg.edgeColor))
      .attr("stroke-width", (d: EdgeLayout) => (highlightEdge(d.id) ? 2 : 1))
      .attr("d", (d: EdgeLayout) => {
        return lineGenerator(d.points.map((p) => [p.x, p.y]));
      });

    svg
      .selectAll<SVGRectElement, VertexLayout>("rect")
      .data(graphLayout.getVertices())
      .join("rect")
      .attr("width", 150)
      .attr("height", 40)
      .attr("x", (v) => v.position.x - 75)
      .attr("y", (v) => v.position.y - 20)
      .attr("rx", 5) // Smooth corners
      .attr("ry", 5) // Smooth corners
      .style("fill", (d: VertexLayout) => (highlightVertex(d.id) ? renderCfg.highlightColor : renderCfg.vertexColor));

    svg
      .selectAll<SVGTextElement, VertexLayout>(".vertex-label")
      .data(graphLayout.getVertices())
      .enter()
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", (d) => d.position.x)
      .attr("y", (d) => d.position.y)
      .attr("text-anchor", "middle")
      .text((d) => d.label.substring(0, 15));
  }
}
