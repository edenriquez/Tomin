"use client"
import Header from '@/components/header'
import {Toaster  } from 'react-hot-toast';
import AnalysisResult from '@/components/analysis'
import UploadFile from '@/components/upload';
import { useState } from 'react';
import { ApiProcessResponse } from '@/lib/api';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<ApiProcessResponse>();
  const [isUploading, setIsUploading] = useState(false);



  return (
    <main 
      className="flex min-h-screen flex-col items-center p-24 relative"
      style={{ background: '#000' }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${analysisResult ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(173deg, rgba(0, 0, 0, 1) 0%, rgba(11, 15, 38, 1) 36%, rgba(255, 255, 255, 1) 100%)'
        }}
      />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <div className="w-full space-y-8 relative z-10">
        <Header className="text-center space-y-2" />
        <div className="transition-all duration-200 ease-in-out">
          {analysisResult ? (
            <AnalysisResult data={analysisResult} />
          ) : (
            <UploadFile 
              setAnalysisResult={setAnalysisResult}
              setIsUploading={setIsUploading}
              isUploading={isUploading}
            />
          )}
        </div>
      </div>
    </main>
  );
}

