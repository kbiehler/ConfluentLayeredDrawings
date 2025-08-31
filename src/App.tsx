import React, { useRef, useState } from "react";
import "./scrollbars.css";
import "./GraphFrontend.css";
import GraphsPanel from "./components/GraphsPanel";
import { ConfigDto, GraphCfgDto } from "./cfg/ConfigDtos";
import { Vertex } from "./model/ds";
import VertexLegend from "./components/new/VertexLegend";
import DisplayModePanel from "./components/new/DisplayModePanel";
import { useLocalStorageState } from "./components/new/LocalStorageState";
import InputPanel from "./components/new/InputPanel";
import Header from "./components/new/Header";

// ---------- Helpers --------------------------------------------------------
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Compute fit scale for a fixed logical canvas with independent scroll area
function computeFitScaleAndScroll(elW, elH, contentW, contentH, minScale = 0.1, maxScale = 8) {
  const kx = elW / contentW;
  const ky = elH / contentH;
  const k = clamp(Math.min(kx, ky), minScale, maxScale);
  const left = Math.max(0, (contentW - elW) / 2);
  const top = Math.max(0, (contentH - elH) / 2);
  return { k, left, top };
}

// ---------- Component -------------------------------------------------------
export default function GraphFrontendProposal() {
  // Demo data
  const [nodes] = useState(() => {
    const demoNodes = Array.from({ length: 30 }).map((_, i) => ({
      id: `n${i + 1}`,
      label: `Node ${i + 1}`,
      raw: { id: `n${i + 1}`, label: `Node ${i + 1}`, type: "node" },
    }));
    return demoNodes;
  });
  const [edges] = useState(() => {
    const demoEdges = [];
    for (let i = 1; i < 30; i++) {
      demoEdges.push({ id: `e${i}`, source: `n${i}`, target: `n${(i % 30) + 1}`, raw: { type: "edge" } });
    }
    return demoEdges;
  });

  // UI state
  const [config, setConfig] = useState(() => new ConfigDto());
  const [graphCfg, setGraphCfg] = useLocalStorageState("graphCfg", new GraphCfgDto());
  const [filters, setFilters] = useState({ search: "", degreeMin: 0, degreeMax: Infinity });
  const [configOpen, setConfigOpen] = useLocalStorageState("configOpen", true);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [displayMode, setDisplayMode] = useState("main");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Viewport/zoom
  const graphContainerRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const cols = 6;
  const gridWidth = 200 + (cols - 1) * 220;
  const rows = Math.ceil(nodes.length / cols);
  const gridHeight = 200 + (rows - 1) * 100;
  const margin = 300;
  const contentWidth = gridWidth + margin * 2;
  const contentHeight = gridHeight + margin * 2;

  function zoom(factor) {
    setScale((k) => clamp(k * factor, 0.1, 8));
  }
  function reset() {
    setScale(1);
    const el = graphContainerRef.current;
    if (el) el.scrollTo({ left: 0, top: 0, behavior: "auto" });
  }
  function fit() {
    const el = graphContainerRef.current;
    if (!el) return;
    const { k, left, top } = computeFitScaleAndScroll(el.clientWidth, el.clientHeight, contentWidth, contentHeight);
    setScale(k);
    el.scrollTo({ left, top, behavior: "auto" });
  }

  function ConfigPanel() {
    return (
      <div className="panel">
        <div className="flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
          <h3>Config</h3>
          <button
            className="text-sm px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setConfigOpen((s) => !s)}
            aria-expanded={configOpen}
          >
            {configOpen ? "Hide" : "Show"}
          </button>
        </div>
        {configOpen && (
          <div className="mt-2 space-y-2">
            <label className="block text-xs">Layout algorithm</label>
            <div className="relative">
              <select className="w-full p-2 pr-10 border rounded appearance-none bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                <option>Force-directed (worker)</option>
                <option>Precomputed (CSV)</option>
                <option>Hierarchical</option>
                <option>Random</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300">▾</span>
            </div>

            <label className="block text-xs">Level-of-detail</label>
            <input type="range" min="0" max="1" step="0.01" defaultValue="0.5" className="w-full accent-indigo-600 dark:accent-indigo-400" />

            <label className="block text-xs">Edge bundling</label>
            <input type="checkbox" className="accent-indigo-600 dark:accent-indigo-400" />

            <label className="block text-xs">Node size by</label>
            <div className="relative">
              <select className="w-full p-2 pr-10 border rounded appearance-none bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                <option>degree</option>
                <option>attribute value</option>
                <option>constant</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300">▾</span>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 rounded bg-blue-600 text-white">Apply</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700">Reset</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <Header fit={fit} zoom={zoom} reset={reset} />

        <main className="main">
          {/* Left sidebar (collapsible) */}
          <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`} aria-expanded={sidebarOpen}>
            {/* Toggle pill always visible inside rail */}
            <button className="sidebar-toggle" title={sidebarOpen ? "Collapse" : "Expand"} onClick={() => setSidebarOpen((s) => !s)}>
              {sidebarOpen ? "⟨" : "⟩"}
            </button>

            <div className={`sidebar-content ${sidebarOpen ? "open" : "closed"}`}>
              <InputPanel graphCfg={graphCfg} setConfig={setGraphCfg} />

              <div className="panel">
                <h3>Number Filter</h3>
                <div className="relative">
                  <select className="input">
                    <option>Force-directed (worker)</option>
                    <option>Precomputed (CSV)</option>
                    <option>Hierarchical</option>
                    <option>Random</option>
                  </select>
                </div>

                <input
                  placeholder="Search label or id"
                  className="input"
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input"
                    placeholder="min deg"
                    onChange={(e) => setFilters((f) => ({ ...f, degreeMin: Number(e.target.value || 0) }))}
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder="max deg"
                    onChange={(e) => setFilters((f) => ({ ...f, degreeMax: Number(e.target.value || Infinity) }))}
                  />
                </div>
                <button className="btn-primary" onClick={() => setFilters({ search: "", degreeMin: 0, degreeMax: Infinity })}>
                  Clear filters
                </button>
              </div>

              <ConfigPanel />
            </div>
          </aside>

          {/* Center: fixed scroll canvas; zoom only affects inner <g> */}
          <section className="flex-1 min-w-0 relative bg-gray-100 dark:bg-gray-950 overflow-hidden">
            <div ref={graphContainerRef} id="graph-canvas" className="w-full h-full overflow-auto bg-white dark:bg-gray-900">
              <GraphsPanel config={config} graphCfg={graphCfg} scale={scale} />
            </div>
            <VertexLegend />
            <DisplayModePanel displayMode={displayMode} setDisplayMode={setDisplayMode} />
          </section>
        </main>

        <footer className="p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          Dark mode supported; fixed scroll canvas; sidebar collapse improved.
        </footer>
      </div>
    </>
  );
}
