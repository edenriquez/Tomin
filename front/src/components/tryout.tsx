export default function TryForFree({ setTryFree, tryFree}: { setTryFree: React.Dispatch<React.SetStateAction<boolean>>, tryFree: boolean }) {
    const buttonBase = "px-5 py-2 m-2 rounded-full hover:opacity-75 transition-opacity duration-300 ease-in-out font-bold"
    const inactive = " hover:text-white bg-gray-800"
    const active = 'border border-white bg-white text-black'


    return (
        <div className="text-center block mx-auto -mt-5">
            <button 
                className={`${buttonBase} ${active}`}
                onClick={() => {setTryFree(!tryFree)}}
            >
                Try for free
            </button>
            <button 
                className={`${buttonBase} ${inactive}`}>
                Sign in
            </button>
        </div>
    )

}