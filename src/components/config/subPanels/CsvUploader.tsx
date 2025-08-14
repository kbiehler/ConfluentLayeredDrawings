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
        border: "2px dashed var(--dz-border)",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        background: isDragActive ? "var(--dz-bg-active)" : "var(--dz-bg)",
        color: "var(--dz-text)",
        cursor: "pointer",
        transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
      }}
      aria-label="CSV file dropzone"
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the CSV file here…</p> : <p>Drag &amp; drop a CSV file here, or click to select one</p>}
    </div>
  );
}
