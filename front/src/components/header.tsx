/* eslint-disable @next/next/no-img-element */
export default function Header({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img className="mx-auto"
        src="/logo.png"
        alt="Tomin logo"
        width={300}
        height={300}
      />
      <h1 className="text-4xl font-bold">tomin</h1>
      <p className="text-lg text-gray-500">AI-powered financial assistant</p>
    </div>
  );
}