import React, { useState } from "react";
import { GraphCfgDto } from "@/cfg/ConfigDtos";
import CSVUploader from "./config/subPanels/CsvUploader";

type Props = {
  graphCfg: GraphCfgDto;
  setConfig: (cfg: GraphCfgDto) => void;
  setShowGraph: (showGraph: boolean) => void;
};

const InputPanel: React.FC<Props> = ({ graphCfg, setConfig, setShowGraph }) => {
  const handleFileUpload = (file: File) => {
    // Process the file (e.g., read contents)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        graphCfg.fileContent = e.target.result as string;
        graphCfg.type = "csv";
        setConfig(new GraphCfgDto(graphCfg));
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
