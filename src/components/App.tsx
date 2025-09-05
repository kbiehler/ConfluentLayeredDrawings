import React, { useRef, useState } from "react";
import "./scrollbars.css";
import "./GraphFrontend.css";
import GraphsPanel from "./center/GraphsPanel";
import { ConfigDto, GraphCfgDto } from "../cfg/ConfigDtos";
import VertexLegend from "./center/VertexLegend";
import DisplayModePanel from "./center/DisplayModePanel";
import { useLocalStorageState } from "./LocalStorageHelper";
import InputPanel from "./left-panel/InputPanel";
import Header from "./header/Header";
import ConfigPanel from "./left-panel/ConfigPanel";
import NumberFilterPanel from "./left-panel/NumberFilterPanel";
import { defaultNumberFilterCfg } from "./left-panel/NumberFilterCfgPanel";
import { F } from "vitest/dist/chunks/reporters.DTtkbAtP.js";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// ---------- Component -------------------------------------------------------
export default function GraphFrontend() {
  // UI state
  const [config, setConfig] = useLocalStorageState("config", new ConfigDto());
  const [graphCfg, setGraphCfg] = useLocalStorageState("graphCfg", new GraphCfgDto());
  const [sidebarOpen, setSidebarOpen] = useLocalStorageState("sidebarOpen", true);
  const [displayMode, setDisplayMode] = useState<"main" | "nbr" | "impl">("main");
  const [filterCfg, setFilterCfg] = useLocalStorageState("filterCfg", defaultNumberFilterCfg);

  // Viewport/zoom
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  function zoom(factor: number) {
    setScale((k) => clamp(k * factor, 0.1, 8));
  }
  function reset() {
    setScale(0.5);
    const el = graphContainerRef.current;
    if (el) el.scrollTo({ left: 0, top: 0, behavior: "auto" });
  }

  return (
    <>
      <div className="app">
        <Header zoom={zoom} reset={reset} />

        <main className="main">
          <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`} aria-expanded={sidebarOpen}>
            <button className="sidebar-toggle" title={sidebarOpen ? "Collapse" : "Expand"} onClick={() => setSidebarOpen((s) => !s)}>
              {sidebarOpen ? "⟨" : "⟩"}
            </button>

            <div className={`sidebar-content ${sidebarOpen ? "open" : "closed"}`}>
              <InputPanel graphCfg={graphCfg} setConfig={setGraphCfg} />
              <NumberFilterPanel filterCfg={filterCfg} config={config} setConfig={setConfig} />
              <ConfigPanel config={config} setConfig={setConfig} filterCfg={filterCfg} setFilterCfg={setFilterCfg} />
            </div>
          </aside>

          {/* Center: fixed scroll canvas; zoom only affects inner <g> */}
          <section className="flex-1 min-w-0 relative bg-gray-100 dark:bg-gray-950 overflow-hidden">
            <div ref={graphContainerRef} id="graph-canvas" className="w-full h-full overflow-auto bg-white dark:bg-gray-900">
              <GraphsPanel config={config} graphCfg={graphCfg} scale={scale} panelSelect={displayMode} setPanelSelect={setDisplayMode} />
            </div>
            <VertexLegend columnCfg={config.columnCfg} />
            <DisplayModePanel displayMode={displayMode} setDisplayMode={setDisplayMode} />
          </section>
        </main>

        <footer className="p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          <a
            href="https://github.com/kbiehler/ConfluentLayeredDrawings"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-200"
          >
            View on GitHub
          </a>
        </footer>
      </div>
    </>
  );
}
