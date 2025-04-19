/* eslint-disable @next/next/no-img-element */
export default function Header({ className }: { className?: string }) {
  return (
    <div className={`relative font-sans ${className}`}>
      <img className="mx-auto"
        src="/logo.png"
        alt="Tomin logo"
        width={300}
        height={300}
      />
      <p className="text-4xl text-white mt-4">AI-Powered Financial Analysis</p>
    </div>
  );
}
