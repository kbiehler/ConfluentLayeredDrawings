import React, { useState } from "react";
import { ConfigDto } from "@/cfg/ConfigDtos";
import { useLocalStorageState } from "../LocalStorageHelper";
import { ColumnCfg, defaultColumns } from "./ColumnConfig";
import { v4 as uuidv4 } from "uuid";
import ColumnPanel from "./ColumnPanel";
import NumberFilterCfgPanel, { NumberFilterCfg } from "./NumberFilterCfgPanel";

type Props = {
  config: ConfigDto;
  setConfig: (cfg: ConfigDto) => void;
  filterCfg: NumberFilterCfg[];
  setFilterCfg: React.Dispatch<React.SetStateAction<NumberFilterCfg[]>>;
};

const ConfigPanel: React.FC<Props> = ({ config, setConfig, filterCfg, setFilterCfg }) => {
  const [configOpen, setConfigOpen] = useLocalStorageState("configOpen", true);

  const [localConfig, setLocalConfig] = useState<ConfigDto>({ ...config });
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleApply = () => {
    setConfig(new ConfigDto(localConfig));
  };

  const Separator = () => <div className="my-3 border-t border-gray-200 dark:border-gray-800" />;

  return (
    <div className="panel">
      <div className="flex items-center justify-between sticky top-0 dark:bg-gray-900 z-10">
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
          <Separator />

          <ColumnPanel config={localConfig} setConfig={setLocalConfig} />
          <Separator />
          <NumberFilterCfgPanel filterCfg={filterCfg} setFilterCfg={setFilterCfg} />

          <button className="btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
