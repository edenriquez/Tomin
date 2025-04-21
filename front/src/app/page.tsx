"use client"
import Header from '@/components/header'
import {Toaster  } from 'react-hot-toast';
import AnalysisResult from '@/components/analysis'
import UploadFile from '@/components/upload';
import { useEffect, useState } from 'react';
import { ApiProcessResponse } from '@/lib/api';
import TryForFree from '@/components/tryout';
import SupportedBrands from '@/components/supported';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { AuthProvider } from '@/lib/auth';


export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<ApiProcessResponse>();
  const [isUploading, setIsUploading] = useState(false);
  const [tryFree, setTryFree] = useState(false);
  
  useEffect(() => {
    googleLogout()
  })

    
  
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
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
          <TryForFree setTryFree={setTryFree} tryFree={tryFree} />
          <SupportedBrands/>
          
          <div className="grid grid-cols-10 gap-4 transition-all duration-500 ease-in-out">
            {/* shows initially */}

            {!analysisResult && !tryFree && (
              /* eslint-disable @next/next/no-img-element */
              <div className={`col-span-8 col-start-2 ease-in-out ${tryFree ? 'opacity-0' : 'opacity-100'}`}>
                <div className="relative">
                  <div 
                    className="absolute inset-x-0 top-0 h-100" 
                    style={{
                      background: 'linear-gradient(to bottom, black, transparent)'
                    }}
                  />
                  <img 
                    className="mx-auto"
                    src="/example.png"
                    alt="example image"
                  />
                </div>
              </div>
            )}
            {/* Only shows when analysis result comes from backend */}
            {analysisResult && (
              <AnalysisResult data={analysisResult} />
            )}
            {/* only shows when user has clicked try for free  */}
            {!analysisResult && tryFree && (
              <UploadFile 
                setAnalysisResult={setAnalysisResult}
                setIsUploading={setIsUploading}
                isUploading={isUploading}
              />
            )}
          </div>
        </div>
      </main>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

