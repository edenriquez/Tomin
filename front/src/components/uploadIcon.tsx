import { UploadCloud as UploadCloudIcon } from 'lucide-react';
export default function UploadIcon({isDragActive}: {isDragActive: boolean}) {

    return (
            <div className="space-y-4">
                <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="space-y-1">
                    <p className="font-medium">
                    {isDragActive ? "Suelta el archivo aqui" : "Arrastra y suelta tu estado de cuenta"}
                    </p>
                    <p className="text-sm text-gray-500">
                    Supported format: PDF (Max 10MB)
                    </p>
                </div>
            </div>
        )
}