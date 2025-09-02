import { useState } from "react";
import ConfigPanel from "@/components/config/ConfigPanel";
import { ConfigDto, GraphCfgDto } from "./cfg/ConfigDtos";
import GraphsPanel from "./components/GraphsPanel";
import "./App.css";
import InputPanel from "./components/left-panel/InputPanel";
import CsvFilterPanel from "./components/csv/CsvFilterPanel";

function App() {
  const [config, setConfig] = useState(() => new ConfigDto());
  const [graphCfg, setGraphCfg] = useState(() => new GraphCfgDto());
  const [showGraph, setShowGraph] = useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <InputPanel graphCfg={graphCfg} setConfig={setGraphCfg} />
      <CsvFilterPanel config={config} setConfig={setConfig} />
      <div style={{ flexShrink: 0, padding: "10px", display: "flex", gap: "10px" }}>
        <GraphsPanel config={config} graphCfg={graphCfg} />
      </div>
      <div style={{ flexShrink: 0 }}>
        {" "}
        {process.env.NODE_ENV === "development" && (
          <div style={{ flexShrink: 0 }}>
            <ConfigPanel config={config} setConfig={setConfig} />
          </div>
        )}
      </div>{" "}
    </div>
  );
}

export default App;
