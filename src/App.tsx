import { useState } from "react";
import ConfigPanel from "@/components/config/ConfigPanel";
import { ConfigDto } from "./cfg/ConfigDtos";
import GraphsPanel from "./components/GraphsPanel";
import "./App.css";
import InputPanel from "./components/InputPanel";
import { Vertex } from "./model/ds";
import VertexLegend from "./components/VertexLegend";

function App() {
  const [config, setConfig] = useState(() => new ConfigDto());
  const [showGraph, setShowGraph] = useState<boolean>(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {" "}
      {(process.env.NODE_ENV === "development" || showGraph) && (
        <div style={{ flexShrink: 0, padding: "10px", display: "flex", gap: "10px" }}>
          <GraphsPanel config={config} />
        </div>
      )}
      {process.env.NODE_ENV != "development" && !showGraph && <InputPanel config={config} setConfig={setConfig} setShowGraph={setShowGraph} />}
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
