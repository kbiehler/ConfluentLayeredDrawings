import { ConfigDto } from "@/cfg/ConfigDtos";
import React, { useState } from "react";
import { NumberFilterCfg } from "./NumberFilterCfgPanel";

export class NumberFilterDto {
  filterType: string = "all";
  smallerGreaterEqual: ">=" | "<=" | "=" = ">=";
  filterNumber: number = 5;
}

type Props = {
  filterCfg: NumberFilterCfg[];
  config: ConfigDto;
  setConfig: React.Dispatch<React.SetStateAction<ConfigDto>>;
};

const NumberFilterPanel: React.FC<Props> = ({ filterCfg, config, setConfig }) => {
  const [localConfig, setLocalConfig] = useState<ConfigDto>({ ...config });

  React.useEffect(() => {
    config.numberFilter.filterType = "all";
    setLocalConfig({ ...config });
  }, [filterCfg]);

  React.useEffect(() => {
    setLocalConfig((prevLocalConfig) => ({
      ...config,
      numberFilter: prevLocalConfig.numberFilter,
    }));
  }, [config]);

  const handleApply = () => {
    setConfig(new ConfigDto(localConfig));
  };

  return (
    <div className="panel">
      <h3>Number Filter</h3>
      <div className="relative">
        <select
          className="input"
          value={localConfig.numberFilter?.filterType ?? "all"}
          onChange={(e) =>
            setLocalConfig((cfg) => ({
              ...cfg,
              numberFilter: {
                ...cfg.numberFilter,
                filterType: e.target.value,
              },
            }))
          }
        >
          <option value="all">Show all</option>
          {filterCfg.map((val) => (
            <option value={val.csvName}>{val.filterName}</option>
          ))}
        </select>
      </div>
      {localConfig.numberFilter?.filterType !== "all" && (
        <div className="flex gap-2">
          <select
            className="input w-20"
            value={localConfig.numberFilter?.smallerGreaterEqual ?? ">="}
            onChange={(e) =>
              setLocalConfig((cfg) => ({
                ...cfg,
                numberFilter: {
                  ...cfg.numberFilter,
                  smallerGreaterEqual: e.target.value as ">=" | "<=" | "=",
                },
              }))
            }
          >
            <option value=">=">&ge;</option>
            <option value="<=">&le;</option>
            <option value="=">=</option>
          </select>
          <input
            type="number"
            className="input"
            placeholder="Number"
            value={localConfig.numberFilter?.filterNumber ?? 5}
            onChange={(e) =>
              setLocalConfig((cfg) => ({
                ...cfg,
                numberFilter: {
                  ...cfg.numberFilter,
                  filterNumber: Number(e.target.value),
                },
              }))
            }
          />
        </div>
      )}
      <button className="btn-primary" onClick={handleApply}>
        Apply Filter
      </button>
    </div>
  );
};

export default NumberFilterPanel;
