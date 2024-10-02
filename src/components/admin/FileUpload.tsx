import React, { useState, useEffect, ChangeEvent } from 'react';

import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface Props {
  onFileSelect: (file1: File | null, file2: File | null) => void;
}

const FileUpload: React.FC<Props> = ({ onFileSelect }) => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [uploadStatus1, setUploadStatus1] = useState<"idle" | "uploading" | "uploaded">("idle");
  const [uploadStatus2, setUploadStatus2] = useState<"idle" | "uploading" | "uploaded">("idle");

  useEffect(() => {
    onFileSelect(file1, file2);
  }, [file1, file2]);
  // const uploadToBackend = async (file: File, setBannerUrl: React.Dispatch<React.SetStateAction<string | null>>): Promise<string | null> => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  
  //   try {
  //     const response = await axios.post('http://localhost:3000/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       }
  //     });
  //     if (response.status === 200) {
  //       const url = response.data;
  //       console.log("Received URL:", url);
  //       setBannerUrl(url);
  //       return url;
  //     }
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  
  //   setBannerUrl(null);  // set the banner URL to null in error cases
  //   return null; // ensure you return null in all other cases
  // };
  
  


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setUploadStatus: React.Dispatch<React.SetStateAction<"idle" | "uploading" | "uploaded">>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  }

  return (
    <div className="flex gap-5 mb-6 -mt-4 w-full">
      <div className="grid w-full max-w-xl items-center gap-4 md:gap-1">
        <Label className="mb-1" htmlFor="banner1">Banner 1</Label>
        <Input id="banner1" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFile1, setUploadStatus1)} />
      </div>

      <div className="grid w-full max-w-xl items-center gap-4 md:gap-1">
        <Label className="mb-1" htmlFor="banner2">Banner 2</Label>
        <Input id="banner2" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFile2, setUploadStatus2)} />
      </div>
    </div>
  );
}
export default FileUpload