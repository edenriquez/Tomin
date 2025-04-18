/* eslint-disable @next/next/no-img-element */
export default function Header({ className }: { className?: string }) {
  return (
    <div className={`font-sans ${className}`}>
      <img className="mx-auto"
        src="/logo.png"
        alt="Tomin logo"
        width={300}
        height={300}
      />
      <p className="text-4xl  text-white">AI-powered financial assistant</p>
    </div>
  );
}