import { Dropzone, Heading, Text } from "@innovaccer/design-system";
import { FileRejection } from "@innovaccer/design-system/dist/core/components/molecules/dropzone/DropzoneBase";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Upload = () => {
  const [files, setFiles] = useState<
    {
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: number;
      _id: string;
    }[]
  >([]);
  const fetchFiles = async (): Promise<void> => {
    const response = await axios.get("http://localhost:4000/api/cases/files", {
      withCredentials: true,
    });
    if (response.data.success) {
      setFiles(response.data.data);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDrop = async (
    event: DragEvent | Event,
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ): Promise<void> => {
    console.log(acceptedFiles, "acceptedFiles");
    console.log(rejectedFiles, "rejectedFiles");
    const acceptedFile = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", acceptedFile);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/cases/upload",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response, "response");
      // Refresh the file list after successful upload
      if (response.data.success) {
        fetchFiles();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const formatFileSize = (fileSize: number): string => {
    if (fileSize < 1024) {
      return `${fileSize} B`;
    } else if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(2)} KB`;
    } else if (fileSize < 1024 * 1024 * 1024) {
      return `${(fileSize / 1024 / 1024).toFixed(2)} MB`;
    }
    return `${(fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const handleDownload = async (
    fileId: string,
    fileName: string
  ): Promise<void> => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/cases/files/${fileId}`,
        {
          withCredentials: true,
          responseType: "blob", // Important: Tell axios to expect binary data
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("File downloaded successfully");
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  return (
    <div>
      <Heading size="m">Upload File</Heading>
      <Dropzone onDrop={handleDrop} />
      {files.length > 0 && (
        <div className="d-flex m-5 border">
          {files.map((file) => (
            <div className="m-2 border p-2" key={file.filePath}>
              <Text
                onClick={() => handleDownload(file._id, file.fileName)}
                appearance="link"
                weight="medium"
                className="mr-2 d-block cursor-pointer"
              >
                {file.fileName}
              </Text>
              <Text weight="medium" className="mr-2 d-block">
                {file.fileType}
              </Text>
              <Text weight="medium" className="mr-2 d-block">
                {formatFileSize(file.fileSize)}
              </Text>
              <Text weight="medium" className="mr-2">
                {file.filePath}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
