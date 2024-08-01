//// !IMPORTANT react dropzone npm i react-dropzone // to be able to drag and drop files into an application . https://react-dropzone.js.org/

import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const FiledUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  // the useCallback hook is a hook to store the function into the cache you knew that back then, and now am telling you again.

  // Please ! NOTE  that we improted the type from dropzone as well . the type is called FileWithPath .
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // console.log(acceptedFiles, "accepted files here !!"); // [File]
      // console.log(acceptedFiles[0], "accepted files[0] here !!"); // File {path: '420169864_773195031516521_1967862260444229526_n (1).jpg', name: '420169864_773195031516521_1967862260444229526_n (1).jpg', lastModified: 1705520606701, lastModifiedDate: Wed Jan 17 2024 21:43:26 GMT+0200 (Eastern European Standard Time), webkitRelativePath: '', …} .

      // console.log(
      // URL.createObjectURL(acceptedFiles[0]),
      // "accepted files as an object here !!"
      // ); // blob:http://localhost:5173/a2ccf787-a3b6-4677-be12-581aed9c4033 accepted files as an object here !!

      // console.log(fileUrl, "fileUrl here !!!");
      // console.log(file, "file Array here !!!");
      // console.log(mediaUrl, "mediaUrl  here !!!"); // the mediaUrl isn't used anywhere in the code as of now.

      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles); // according to bing this calls the onChange function and sends the file array to the input.
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  /// the second parameter in the useDropzone hook is the accept object, you pust what can the from accept from the user .

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer " />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag phto to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 smaill-regular mb-6">SVG, PNG, JPG</p>
          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FiledUploader;
