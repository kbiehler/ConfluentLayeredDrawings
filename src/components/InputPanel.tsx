import React, { useState } from "react";
import { ConfigDto, GraphCfgDto } from "@/cfg/ConfigDtos";
import CSVUploader from "./config/subPanels/CsvUploader";

type Props = {
  config: ConfigDto;
  setConfig: (cfg: ConfigDto) => void;
  setShowGraph: (showGraph: boolean) => void;
};

const InputPanel: React.FC<Props> = ({ config, setConfig, setShowGraph }) => {
  const [localConfig, setLocalConfig] = useState<ConfigDto>({ ...config });

  const handleChange = (category: keyof ConfigDto, field: string, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleFileUpload = (file: File) => {
    // Process the file (e.g., read contents)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        config.graphCfg.fileContent = e.target.result as string;
        config.graphCfg.type = "csv";
        handleChange("graphCfg", "fileContent", e.target.result);
        setConfig(new ConfigDto(localConfig));
        setShowGraph(true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <CSVUploader handleFileUpload={handleFileUpload} />
    </div>
  );
};

export default InputPanel;
