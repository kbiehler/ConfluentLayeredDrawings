import { EdgeLayout, GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import * as d3 from "d3";
import { VertexId } from "@/model/types";

export interface RenderCfg {
  vertexColor: string;
  highlightColor: string;
  edgeColor: string;
  showCliqueCenter: boolean;
}

export class GraphSVGRenderer {
  render(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>, //
    graphLayout: GraphLayout,
    renderCfg: RenderCfg,
    highlightVertex: (vertexId: VertexId) => boolean,
    highlightEdge: (edgeId: string) => boolean,
    isSelectedVertex: (vertexId: VertexId) => boolean,
    markVertex: (vertexId: VertexId) => boolean
  ) {
    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    //draw first non-highlighed edges, then highlighted
    const edges = graphLayout.getEdgeDrawings().sort((a, b) => {
      if (highlightEdge(a.id) === highlightEdge(b.id)) return 0;
      return highlightEdge(a.id) ? 1 : -1;
    });

    svg
      .selectAll<SVGPathElement, EdgeLayout>("path")
      .data(edges)
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", (d: EdgeLayout) => (highlightEdge(d.id) ? renderCfg.highlightColor : renderCfg.edgeColor))
      .attr("stroke-width", (d: EdgeLayout) => (highlightEdge(d.id) ? 5 : 1))
      .attr("d", (d: EdgeLayout) => {
        return lineGenerator(d.points.map((p) => [p.x, p.y]));
      });

    svg
      .selectAll<SVGRectElement, VertexLayout>("rect")
      .data(graphLayout.getVertices().filter((v) => v.draw))
      .join("rect")
      .attr("width", (v) => v.width)
      .attr("height", (v) => v.height)
      .attr("x", (v) => v.position.x - v.width / 2)
      .attr("y", (v) => v.position.y - v.height / 2)
      .attr("rx", 5) // Smooth corners
      .attr("ry", 5) // Smooth corners
      .attr("stroke", "black")
      .attr("stroke-width", (v) => (isSelectedVertex(v.id) || markVertex(v.id) ? 3 : 1))
      .style("fill", (v) => (highlightVertex(v.id) ? renderCfg.highlightColor : renderCfg.vertexColor))
      .on("mouseover", function (_, d) {
        d3.select(this).append("title").text(d.label);
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });

    if (renderCfg.showCliqueCenter) {
      svg
        .selectAll<SVGRectElement, VertexLayout>("centers")
        .data(graphLayout.getVertices().filter((v) => !v.draw))
        .join("rect")
        .attr("width", (v) => 10)
        .attr("height", (v) => 10)
        .attr("x", (v) => v.position.x - 5)
        .attr("y", (v) => v.position.y - 5);
    }

    svg
      .selectAll<SVGTextElement, VertexLayout>(".vertex-label")
      .data(graphLayout.getVertices())
      .data(graphLayout.getVertices().filter((v) => v.draw))
      .enter()
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", (d) => d.position.x)
      .attr("y", (d) => d.position.y + 5)
      .attr("text-anchor", "middle")
      .text((d) => d.displayLabel)
      .on("mouseover", function (_, d) {
        d3.select(this).append("title").text(d.label);
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });
  }
}
