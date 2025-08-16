import React, { useState } from "react";
import { ConfigDto } from "@/cfg/ConfigDtos";
import NumberCfgPanel from "./NumberFilterPanel";
import "./CsvFilterPanel.css";
type Props = {
  config: ConfigDto;
  setConfig: (cfg: ConfigDto) => void;
};

const CsvFilterPanel: React.FC<Props> = ({ config, setConfig }) => {
  const [localConfig, setLocalConfig] = useState<ConfigDto>({ ...config });

  const handleChange = (category: keyof ConfigDto, field: string, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleApply = () => {
    setConfig(new ConfigDto(localConfig));
  };

  return (
    <div className="filter-card">
      <NumberCfgPanel config={localConfig.numberCfg} handleChange={(field, value) => handleChange("numberCfg", field, value)} />
      <button className="apply-btn" onClick={handleApply}>
        Apply Filter
      </button>
    </div>
  );
};

export default CsvFilterPanel;
