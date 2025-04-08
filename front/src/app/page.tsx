"use client"
import { Accept, useDropzone } from 'react-dropzone';
import Header from '@/components/header'
import UploadIcon from '@/components/uploadIcon';
import { uploadPdf, ApiProcessResponse, ping } from '@/lib/api';
import toast, {Toaster  } from 'react-hot-toast';
import { useState } from 'react';
import AnalysisResult from '@/components/analysis'

export default function Home() {
  const accept: Accept = { 
    'application/pdf': ['.pdf']
  }
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ApiProcessResponse>();

  const handleHealthCheck = async () => {
    try {
      const healthStatus = await ping();
      toast.success(`Status: ${healthStatus.body.status}`);
    } catch {
      toast.error('Error in health check');
    }
  };

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

  const dahsedBorder = 'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors '
  const dragStyle = isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <div className="w-full space-y-8">
        <Header className="text-center space-y-2" />
          <button
            onClick={handleHealthCheck}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto block"
          >
            Verify service health
          </button>
        <div className="transition-all duration-300 ease-in-out">
          {analysisResult ? (
            <AnalysisResult data={analysisResult} />
          ) : (
            <div
              {...getRootProps()}
              className={`${dahsedBorder} ${dragStyle} ${isUploading ? 'cursor-wait' : ''}`}
            >
              <input {...getInputProps()} type="file" accept="application/pdf" />
              {isUploading ? (
                <div className="space-y-4 w-full">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="font-medium">{uploadProgress}</p>
                </div>
              ) : (
                <UploadIcon isDragActive={isDragActive}  />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

