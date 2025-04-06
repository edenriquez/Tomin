import axios from 'axios';


export type ApiProcessResponse = {
  filename: string;
  size: number;
  analysis: unknown;
};


export const uploadPdf = async (file: File, onProgress?: (progress: number) => void): Promise<ApiProcessResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<ApiProcessResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/process`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.progress || 0;
          onProgress?.(percentCompleted);
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload PDF');
  }
};