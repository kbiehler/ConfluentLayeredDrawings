import { ConfigDto } from "@/cfg/ConfigDtos";
import { ColumnCfg } from "./ColumnConfig";
import { v4 as uuidv4 } from "uuid";

type Props = {
  config: ConfigDto;
  setConfig: React.Dispatch<React.SetStateAction<ConfigDto>>
};

const ColumnPanel: React.FC<Props> = ({ config, setConfig }) => {
  const addLegend = () =>
    setConfig((prevConfig) => ({
      ...prevConfig,
      columnCfg: [...(prevConfig.columnCfg ?? []), { id: uuidv4(), csvName: "", legendName: "", color: "#ff6347" }],
    }));
  const removeLegend = (id: string) =>
    setConfig((prevConfig) => ({
      ...prevConfig,
      columnCfg: prevConfig.columnCfg.filter((c) => c.id !== id),
    }));
  const updateLegend = (id: string, patch: Partial<ColumnCfg>) =>
    setConfig((prevConfig) => ({
      ...prevConfig,
      columnCfg: prevConfig.columnCfg.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));


  return (
    // CSV → Legend Mapping
    <div className="mt-3">
      <div className="font-semibold text-sm mb-2">CSV Columns:</div>
      <div className="space-y-2">
        {config.columnCfg.map((col) => (
          <div key={col.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
            <input className="input" placeholder="CSV column" value={col.csvName} onChange={(e) => updateLegend(col.id, { csvName: e.target.value })} />
            <input
              className="input"
              placeholder="Legend label"
              value={col.legendName}
              onChange={(e) => updateLegend(col.id, { legendName: e.target.value })}
            />
            <input
              type="color"
              className="h-10 w-10 border border-gray-300 dark:border-gray-700 rounded  mt-2 px-0.5 py-0.5"
              value={col.color}
              onChange={(e) => updateLegend(col.id, { color: e.target.value })}
              title="Legend color"
            />
            <button
              type="button"
              className="px-2 py-1 h-8 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 mt-2"
              onClick={() => removeLegend(col.id)}
              title="Delete this column"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={addLegend}
        >
          ＋ Add column
        </button>
      </div>
    </div>
  );
};

export default ColumnPanel;
