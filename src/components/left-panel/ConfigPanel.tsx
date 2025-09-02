import React, { useState } from "react";
import { ConfigDto } from "@/cfg/ConfigDtos";
import { useLocalStorageState } from "../LocalStorageState";
import { ColumnCfg, defaultColumns } from "./ColumnConfig";
import { v4 as uuidv4 } from "uuid";
import ColumnPanel from "./ColumnPanel";

type Props = {
  config: ConfigDto;
  setConfig: (cfg: ConfigDto) => void;
};

const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  const [configOpen, setConfigOpen] = useLocalStorageState("configOpen", true);

  const [localConfig, setLocalConfig] = useState<ConfigDto>({ ...config });
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleApply = () => {
    setConfig(new ConfigDto(localConfig));
  };

  const addLegend = () =>
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      columnCfg: [...(prevConfig.columnCfg ?? []), { id: uuidv4(), csvName: "", legendName: "", color: "#ff6347" }],
    }));
  const removeLegend = (id: string) =>
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      columnCfg: prevConfig.columnCfg.filter((c) => c.id !== id),
    }));
  const updateLegend = (id: string, patch: Partial<ColumnCfg>) =>
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      columnCfg: prevConfig.columnCfg.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

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
          <ColumnPanel config={localConfig} setConfig={setLocalConfig} />

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

          <button className="btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
