import * as d3 from "d3";
import { GraphLayout } from "@/model/layout/GraphLayout";
import React, { useEffect, useRef } from "react";
import { GraphSVGRenderer, RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { InteractionManager } from "@/model/renderer/InteractionManager";
import { SvgEventController } from "@/model/renderer/SvgEventController";
import "./GraphSvg.css";

interface DrawingProps {
  graphLayout: GraphLayout;
  renderCfg: RenderCfg;
  interactionManager: InteractionManager;
  scale: number;
}

const GraphSvg: React.FC<DrawingProps> = ({ graphLayout: graphDrawing, renderCfg, interactionManager, scale }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  interactionManager.removeAllListeners("redraw");
  interactionManager.on("redraw", () => {
    console.log("redraw");
    draw(svgRef!, graphDrawing, renderCfg, interactionManager, scale);
  });

  useEffect(() => {
    console.log("redraw");
    draw(svgRef!, graphDrawing, renderCfg, interactionManager, scale);
  }, [graphDrawing]);

  useEffect(() => {
    let [addWidth, addHeight] = [40, 40];
    console.log("change scale");
    let [width, height] = graphDrawing.getSize();
    d3.select(svgRef.current)
      .attr("width", (width + addWidth) * scale)
      .attr("height", (height + addHeight) * scale);
  }, [scale]);

  return (
    <div id="graph-container" style={{ display: "inline-block" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

function draw(
  svgRef: React.RefObject<SVGSVGElement | null>, //
  graphDrawing: GraphLayout,
  renderCfg: RenderCfg,
  interactionManager: InteractionManager,
  scale: number
) {
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  let [width, height] = graphDrawing.getSize();
  let [xShift, yShift] = graphDrawing.getShift();
  let [addWidth, addHeight] = [40, 40];
  let [xAddShift, yAddShift] = [30, 30];

  svg
    .attr("width", (width + addWidth) * scale)
    .attr("height", (height + addHeight) * scale)
    .attr("viewBox", `0 0 ${width + addWidth} ${height + addHeight}`);

  const g = svg.append("g").attr("transform", `translate(${xShift + xAddShift}, ${yShift + yAddShift})`);
  //g contains actual drawing, shifted by shift of drawing + additional px
  // const g = svg.append("g").attr("class", "zoom-group").attr("transform", `scale(${scale})`);

  new GraphSVGRenderer().render(
    g,
    graphDrawing,
    renderCfg,
    (vertexId) => interactionManager.highlightVertex(vertexId),
    (edgeId) => interactionManager.highlightEdge(edgeId),
    (vertexId) => interactionManager.isSelectedVertex(vertexId),
    (vertexID) => interactionManager.markVertex(vertexID)
  );
  new SvgEventController(interactionManager).attachListeners(g);
}

export default GraphSvg;
