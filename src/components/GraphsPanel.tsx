import React from "react";
import GraphSvg from "@/components/GraphSvg";
import { generateLayout } from "@/model/layout/GraphLayoutGenerator";
import { useEffect, useState } from "react";
import { ConfigDto, mapToRenderCfg, mapToGraphLayoutCfg } from "@/cfg/ConfigDtos";
import { loadFromCfg, loadFromSelection } from "@/input/GraphLoader";
import { GraphLayout } from "@/model/layout/GraphLayout";
import { InteractionManager, MarkVertexInteractionManager } from "@/model/renderer/InteractionManager";
import { Graph } from "@/model/ds";

interface GraphsPanelProps {
  config: ConfigDto;
}

const GraphsPanel: React.FC<GraphsPanelProps> = ({ config }) => {
  const [layout, setLayout] = useState(() => new GraphLayout());
  const [graph, setGraph] = useState(() => new Graph());
  const [interactMgr, setInteractMgr] = useState(() => new InteractionManager());
  const [renderCfg, setRenderCfg] = useState(() => mapToRenderCfg(config));
  const [panelSelect, setPanelSelect] = useState<"main" | "nbr">("main");

  useEffect(() => {
    const G = loadFromCfg(config.graphCfg);
    setGraph(G);
    const [tmpLayout, tmpInteractInfo] = generateLayout(G, mapToGraphLayoutCfg(config));
    setLayout(tmpLayout);
    setInteractMgr(new InteractionManager(tmpInteractInfo));
    setRenderCfg(mapToRenderCfg(config));
  }, [config]);

  const [nbrLayout, setNbrLayout] = useState(() => new GraphLayout());
  const [nbrInteractMgr, setNbrInteractManager] = useState(() => new InteractionManager());

  useEffect(() => {
    if (panelSelect === "main") {
      return;
    } else if (panelSelect === "nbr") {
      const G = loadFromSelection(graph, interactMgr.state.selectedVertices);
      const [tmpLayout, _] = generateLayout(G, mapToGraphLayoutCfg(config));
      setNbrInteractManager(new MarkVertexInteractionManager(interactMgr.state.selectedVertices));
      setNbrLayout(tmpLayout);
    }
  }, [panelSelect]);

  return (
    <div>
      <div style={{ flexShrink: 0, padding: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setPanelSelect("main")} style={{ background: panelSelect === "main" ? "#ddd" : "#fff" }}>
          Main Graph
        </button>
        <button onClick={() => setPanelSelect("nbr")} style={{ background: panelSelect === "nbr" ? "#ddd" : "#fff" }}>
          Show selected + neighbours
        </button>
      </div>
      <div style={{ flexGrow: 1 }}>
        {panelSelect === "main" ? (
          <GraphSvg graphLayout={layout} renderCfg={renderCfg} interactionManager={interactMgr} />
        ) : (
          <GraphSvg graphLayout={nbrLayout} renderCfg={renderCfg} interactionManager={nbrInteractMgr} />
        )}
      </div>
    </div>
  );
};

export default GraphsPanel;
