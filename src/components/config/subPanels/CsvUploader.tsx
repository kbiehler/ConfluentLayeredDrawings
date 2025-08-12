import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  handleFileUpload: (file: File) => void;
}

export default function CSVUploader({ handleFileUpload }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #888",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        background: isDragActive ? "#e0f7fa" : "#fafafa",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the CSV file here…</p> : <p>Drag & drop a CSV file here, or click to select one</p>}
    </div>
  );
}
