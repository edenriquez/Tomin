import axios from 'axios';


export type ApiProcessResponse = {
  body: {
    filename: string;
    size: number;
    analysis: unknown;
  }
};

export type ApiHealthResponse = {
  body: {
    status: string;
    service: string;
    timestamp: string;
  }
};

// const BASE_URL = `https://i7hl4me64iadbkql4tjcpt5m6q0vgwos.lambda-url.us-east-1.on.aws`
const BASE_URL = `http://localhost:8000`

export const ping = async (): Promise<ApiHealthResponse> => {
  try{
    const response = await axios.get<ApiHealthResponse>(
      `${BASE_URL}/health`,
      { timeout: 60000,
        headers:{
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers":" uthorization",
          "Origin": "https://localhost:8080"
        }
       }
    )
    return response.data
  }catch (error) {
    console.error('Health check failed :', error);
    throw new Error('Failed Health check');
  }

} 

export const uploadPdf = async (file: File, onProgress?: (progress: number) => void): Promise<ApiProcessResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<ApiProcessResponse>(
      `${BASE_URL}/process`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.progress || 0;
          onProgress?.(percentCompleted);
        },
      }
    );
  
    return response.data
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload PDF');
  }
};