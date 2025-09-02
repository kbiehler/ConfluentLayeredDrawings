import { ConfigDto } from "@/cfg/ConfigDtos";
import { v4 as uuidv4 } from "uuid";

type Props = {
  config: ConfigDto;
  setConfig: React.Dispatch<React.SetStateAction<ConfigDto>>;
};

export type NumberFilterCfg = { id: string; csvName: string; filterName: string };

export const defaultNumberFilterCfg: NumberFilterCfg[] = [
  { id: uuidv4(), csvName: "criticality number", filterName: "Criticality Number" },
  { id: uuidv4(), csvName: "probability number", filterName: "Probability Number" },
  { id: uuidv4(), csvName: "severity number", filterName: "Severity Number" },
];

const NumberFilterCfgPanel: React.FC<Props> = ({ config, setConfig }) => {
  const addFilter = () =>
    setConfig((prevConfig) => ({
      ...prevConfig,
      filterCfg: [...(prevConfig.filterCfg ?? []), { id: uuidv4(), csvName: "", filterName: "", color: "#ff6347" }],
    }));
  const removeFilter = (id: string) =>
    setConfig((prevConfig) => ({
      ...prevConfig,
      filterCfg: prevConfig.filterCfg.filter((c) => c.id !== id),
    }));
  const updateFilter = (id: string, patch: Partial<NumberFilterCfg>) =>
    setConfig((prevConfig) => ({
      ...prevConfig,
      filterCfg: prevConfig.filterCfg.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

  return (
    <div className="mt-3">
      <div className="font-semibold text-base mb-2">Number Filters:</div>
      <div className="space-y-2">
        {config.filterCfg.map((col) => (
          <div key={col.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
            <input className="input" placeholder="CSV column" value={col.csvName} onChange={(e) => updateFilter(col.id, { csvName: e.target.value })} />
            <input className="input" placeholder="Filter Name" value={col.filterName} onChange={(e) => updateFilter(col.id, { filterName: e.target.value })} />
            <button
              type="button"
              className="px-2 py-1 h-8 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 mt-2"
              onClick={() => removeFilter(col.id)}
              title="Delete this column"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={addFilter}
        >
          ＋ Add Filter
        </button>
      </div>
    </div>
  );
};

export default NumberFilterCfgPanel;
