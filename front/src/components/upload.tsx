"use client"
import { Accept, useDropzone } from 'react-dropzone';
import UploadIcon from '@/components/uploadIcon';
import { ApiProcessResponse, uploadPdf } from '@/lib/api';
import toast from 'react-hot-toast';
import { Dispatch, SetStateAction, useState } from 'react';



const accept: Accept = { 
    'application/pdf': ['.pdf']
  }

export default function UploadFile({ 
  setAnalysisResult, 
  setIsUploading, 
  isUploading 
}: { 
  setAnalysisResult: Dispatch<SetStateAction<ApiProcessResponse | undefined>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>,
  isUploading: boolean
}) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: accept,
        multiple: false,
        onDropAccepted: async (files) => {
          try {
            setIsUploading(true);
            const response = await uploadPdf(files[0], (progress) => {
              setUploadProgress(Math.round(progress * 100));
            });
    
            toast.success("Archivo cargado correctamente");
            setAnalysisResult(response);
          } catch {
            setUploadProgress(0);
            toast.error("archivo cargado incorrectamente");
          } finally {
            setIsUploading(false);
          }
        },
      });
    
      const dahsedBorder = 'pt-20 h-[300] col-span-6 col-start-3  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors'
      const dragStyle = isDragActive ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100' : 'border-gray-300 hover:border-gray-400'
    
    return (
        <div
              {...getRootProps()}
              className={`${dahsedBorder} ${dragStyle} ${isUploading ? 'cursor-wait' : ''} w-full  mx-auto`}
            >
              <input {...getInputProps()} type="file" accept="application/pdf" />
              {isUploading ? (
                <div className=" space-y-2 w-full h-full flex flex-col ">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden ">
                    <div 
                      className="h-3 bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-lg font-semibold text-emerald-600">{uploadProgress}%</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <UploadIcon isDragActive={isDragActive} />
                </div>
              )}
            </div>
    )
}