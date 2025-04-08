import Image from "next/image";
export default function Header({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image className="mx-auto"
        src="https://tomin-ai.s3.us-east-1.amazonaws.com/logo.png" 
        alt="Tomin logo"
        width={300}
        height={300}
        priority
      />
      <h1 className="text-4xl font-bold">tomin</h1>
      <p className="text-lg text-gray-500">AI-powered financial assistant</p>
    </div>
  );
}