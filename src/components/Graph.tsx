import * as d3 from "d3";
import { EdgeDrawing, GraphDrawing, VertexDrawing } from "@/model/drawing/GraphDrawing";
import React, { useEffect, useRef, useState } from "react";

export interface DrawCfg {
  vertexColor: string;
  highlightColor: string;
}

interface DrawingProps {
  graphDrawing: GraphDrawing;
  drawCfg: DrawCfg;
}

const Graph: React.FC<DrawingProps> = ({ graphDrawing, drawCfg }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedVertices, setSelectedVertices] = useState(new Set<String>());

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let [width, height] = graphDrawing.getSize();

    width += 100;
    height += 100;

    svg.attr("width", width).attr("height", height);
    //g contains actual drawing, shifted by 50, 50
    const g = svg.append("g").attr("transform", `translate(50, 50)`);

    g.selectAll<SVGCircleElement, VertexDrawing>("circle")
      .data(graphDrawing.getVertices())
      .join("circle")
      .attr("r", 10)
      .attr("cx", (v) => v.position.x)
      .attr("cy", (v) => v.position.y)
      .style("fill", (d: VertexDrawing) => (selectedVertices.has(d.id) ? drawCfg.highlightColor : drawCfg.vertexColor));
    g.selectAll<SVGCircleElement, VertexDrawing>("circle").on("click", (event, value) => {
      selectedVertices.add(value.id);
      setSelectedVertices(new Set(selectedVertices));
    });

    g.selectAll<SVGCircleElement, VertexDrawing>(".circle-label")
      .data(graphDrawing.getVertices().filter((d: VertexDrawing) => d.label.length < 10))
      .enter()
      .append("text")
      .attr("class", "vertex-label")
      .attr("x", (d) => d.position.x)
      .attr("y", (d) => d.position.y)
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d) => d.label);

    const lineGenerator = d3.line<[number, number]>().curve(d3.curveBasis);

    g.selectAll<SVGPathElement, EdgeDrawing>("path")
      .data(graphDrawing.getEdgeDrawings())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 1)
      .attr("d", (d: EdgeDrawing) => {
        return lineGenerator(d.points.map((p) => [p.x, p.y]));
      });
  }, [selectedVertices, graphDrawing]);

  return (
    <div style={{ display: "inline-block" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Graph;
