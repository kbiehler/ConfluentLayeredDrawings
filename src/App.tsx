import GraphSvg from "@/components/GraphSvg";
import { generateLayout } from "@/model/layout/GraphLayoutGenerator";
import { useEffect, useState } from "react";
import ConfigPanel from "@/components/config/ConfigPanel";
import { ConfigDto, mapToRenderCfg, mapToGraphLayoutCfg } from "./cfg/ConfigDtos";
import { loadFromCfg } from "@/input/GraphLoader";
import { GraphLayout } from "./model/layout/GraphLayout";
import { InteractionInfo } from "./model/renderer/InteractionManager";

function App() {
  console.log("start app");
  const [config, setConfig] = useState(() => new ConfigDto());
  const [layout, setLayout] = useState(() => new GraphLayout());
  const [interactionInfo, setInteractionInfo] = useState(() => ({ adjEdges: new Map(), adjVertices: new Map() } as InteractionInfo));
  const [renderCfg, setRenderCfg] = useState(() => mapToRenderCfg(config));
  
  useEffect(() => {
    const G = loadFromCfg(config.graphCfg);
    const [tmpLayout, tmpInteractionInfo] = generateLayout(G, mapToGraphLayoutCfg(config));
    setLayout(tmpLayout);
    setInteractionInfo(tmpInteractionInfo);
    setRenderCfg(mapToRenderCfg(config));
  }, [config]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {" "}
      <div style={{ flexShrink: 0 }}>
        {" "}
        <ConfigPanel config={config} setConfig={setConfig} />{" "}
      </div>{" "}
      <div style={{ flexGrow: 1 }}>
        {" "}
        <GraphSvg graphLayout={layout} renderCfg={renderCfg} interactionInfo={interactionInfo} />{" "}
      </div>{" "}
    </div>
  );
}

export default App;
