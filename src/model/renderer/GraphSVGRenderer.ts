import { EdgeLayout, GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import * as d3 from "d3";
import { path as d3path } from "d3-path";
import { VertexId } from "@/model/types";
import { mergeEdgeDrawings } from "@/model/renderer/EdgeMerger";
import { CsvVertex } from "@/input/CsvParser";

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
    // const edges = graphLayout.getEdgeDrawings().sort((a, b) => {
    //   if (highlightEdge(a.id) === highlightEdge(b.id)) return 0;
    //   return highlightEdge(a.id) ? 1 : -1;
    // });
    const edgesNoHighlight = mergeEdgeDrawings(graphLayout.getEdgeDrawings().filter((e) => !highlightEdge(e.id)));
    const edgesHighlight = mergeEdgeDrawings(graphLayout.getEdgeDrawings().filter((e) => highlightEdge(e.id)));
    edgesNoHighlight.forEach((e) => (e.id = "no_highlight"));
    edgesHighlight.forEach((e) => (e.id = "highlight"));

    [...edgesNoHighlight, ...edgesHighlight].forEach((edge) => {
      const p = d3path();

      if (edge.points.length === 2) {
        p.moveTo(edge.points[0].x, edge.points[0].y);

        edge.points.slice(1).forEach((point) => {
          p.lineTo(point.x, point.y);
        });
      } else if (edge.points.length > 2) {
        p.moveTo(edge.points[0].x, edge.points[0].y);
        p.quadraticCurveTo(edge.points[1].x, edge.points[1].y, edge.points[2].x, edge.points[2].y);
      }
      svg
        .append("path")
        .attr("d", p.toString())
        .attr("fill", "none")
        .attr("stroke", edge.id == "highlight" ? renderCfg.highlightColor : renderCfg.edgeColor)
        .attr("stroke-width", edge.id == "highlight" ? 5 : 1)
        .attr("transform", "translate(0.5,0.5)")
        .attr("stroke-opacity", 1)
        .attr("stroke-miterlimit", 1);
    });

    // const edges = [...edgesNoHighlight, ...edgesHighlight];

    // svg
    //   .selectAll<SVGPathElement, EdgeLayout>("path")
    //   .data(edges)
    //   .join("path")
    //   .attr("fill", "none")
    //   .attr("stroke", (d: EdgeLayout) => (d.id == "highlight" ? renderCfg.highlightColor : renderCfg.edgeColor))
    //   .attr("stroke-width", (d: EdgeLayout) => (d.id == "highlight" ? 5 : 1))
    //   .attr("d", (d: EdgeLayout) => {
    //     return lineGenerator(d.points.map((p) => [p.x, p.y]));
    //   })
    //   .attr("transform", "translate(0.5,0.5)")
    //   .attr("stroke-opacity", 1)
    //   .attr("stroke-miterlimit", 1);

    const defs = svg.append("defs");

    const shadow = defs.append("filter").attr("id", "drop-shadow").attr("height", "150%");
    shadow
      .append("feDropShadow")
      .attr("dx", 3) // Shadow x-offset
      .attr("dy", 3) // Shadow y-offset
      .attr("stdDeviation", 3) // Blur amount
      .attr("flood-color", "rgba(0,0,0,0.5)");

    const vertexGroups = svg
      .selectAll<SVGGElement, VertexLayout>(".vertex-group")
      .data(graphLayout.getVertices().filter((v) => v.draw))
      .join("g")
      .attr("class", "vertex-group")
      .attr("transform", (v) => `translate(${v.position.x}, ${v.position.y})`)
      .on("mouseenter", function (_, v) {
        d3.select(this)
          .select("rect")
          .attr("filter", "url(#drop-shadow)")
          .transition()
          .duration(200)
          .style("fill", d3.color(renderCfg.highlightColor)?.brighter(1).toString() || "lightgray");
      })
      .on("mouseleave", function (_, v) {
        d3.select(this)
          .select("rect")
          .attr("filter", null)
          .transition()
          .duration(200)
          .style("fill", highlightVertex(v.id) ? renderCfg.highlightColor : renderCfg.vertexColor)
          .attr("stroke-width", isSelectedVertex(v.id) || markVertex(v.id) ? 3 : 1);
      })
      .on("mouseover", function (_, d) {
        d3.select(this).append("title").text(d.label);
      })
      .on("mouseout", function () {
        d3.select(this).select("title").remove();
      });

    vertexGroups
      .append("rect")
      .attr("width", (v) => v.width)
      .attr("height", (v) => v.height)
      .attr("x", (v) => -v.width / 2)
      .attr("y", (v) => -v.height / 2)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("stroke", "black")
      .attr("stroke-width", (v) => (isSelectedVertex(v.id) || markVertex(v.id) ? 3 : 1))
      .style("fill", (v) => (highlightVertex(v.id) ? renderCfg.highlightColor : renderCfg.vertexColor));

    // Map properties → label + color
    const propDefs = [
      { key: "isFunction", label: "Function", color: "#3b82f6", func: (v: CsvVertex) => v.isFunction() }, // blue
      { key: "failureMode", label: "Failure Mode", color: "#ef4444", func: (v: CsvVertex) => v.isFailureMode() }, // red
      { key: "failureCause", label: "Failure Cause", color: "#f59e0b", func: (v: CsvVertex) => v.isFailureCause() }, // amber
      { key: "failureDetection", label: "Failure Detection", color: "#10b981", func: (v: CsvVertex) => v.isFailureDetection() }, // green
      { key: "compensationProvision", label: "Compensation Provision", color: "#8b5cf6", func: (v: CsvVertex) => v.isCompensationProvision() }, // violet
    ];

    vertexGroups
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", 0)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .text((d) => d.displayLabel);

    vertexGroups.each(function (v, i) {
      const g = d3.select(this);
      const clipId = `clip-${crypto.randomUUID()}`;

      const rectX = -v.width / 2;
      const rectY = -v.height / 2;
      const rectW = v.width;
      const rectH = v.height;
      const rx = 5,
        ry = 5;

      const barWidth = 8; // width of the colored bar area
      const barX = rectX + rectW - barWidth; // right edge inside

      const active = propDefs.filter((p) => v.csvVertex != null && p.func(v.csvVertex));

      const n = active.length;
      if (!n) return;

      // clipPath for rounded rect
      g.append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("rx", rx)
        .attr("ry", ry);

      // bars + dividers in a clipped group
      const barsG = g.append("g").attr("clip-path", `url(#${clipId})`);

      const segH = rectH / n;

      // bars
      barsG
        .selectAll("rect.bar")
        .data(active, (d) => d.key)
        .join("rect")
        .attr("class", "bar")
        .attr("x", barX)
        .attr("y", (_, i) => rectY + i * segH)
        .attr("width", barWidth)
        .attr("height", segH)
        .attr("fill", (d) => d.color)
        .append("title")
        .text((d) => d.label);

      // left border of bar area
      barsG.append("rect").attr("x", barX).attr("y", rectY).attr("width", 1).attr("height", rectH).attr("fill", "black");

      // dividers between bars
      if (n > 1) {
        barsG
          .selectAll("rect.divider")
          .data(d3.range(1, n))
          .join("rect")
          .attr("class", "divider")
          .attr("x", barX + 1)
          .attr("y", (i) => rectY + i * segH)
          .attr("width", barWidth - 2)
          .attr("height", 1)
          .attr("fill", "black");
      }

      // outer stroke on top to hide antialiasing
      g.append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("rx", rx)
        .attr("ry", ry)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1);
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
  }
}
