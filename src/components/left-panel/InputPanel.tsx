import React, { useState } from "react";
import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  graphCfg: GraphCfgDto;
  setConfig: (cfg: GraphCfgDto) => void;
};

const InputPanel: React.FC<Props> = ({ graphCfg, setConfig }) => {
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        graphCfg.fileContent = e.target.result as string;
        graphCfg.type = "csv";
        setConfig(new GraphCfgDto(graphCfg));
      }
    };
    reader.readAsText(file);
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    noClick: true, // prevents auto-click when clicking inside dropzone
  });

  return (
    <div className="panel">
      <h3>Data</h3>
      <div
        {...getRootProps({
          className: `dropzone border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-gray-300 dark:border-gray-700"
          }`,
        })}
      >
        <input {...getInputProps()} />
        <p className="text-sm">Drag &amp; drop CSV here</p>
        <p className="text-xs">or</p>
        <button
          type="button"
          onClick={open}
          className="mt-2 px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Upload CSV
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
