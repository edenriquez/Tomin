import { ApiResponseEnvelope, subscribe } from "@/lib/api";
import { Dispatch, SetStateAction, useState } from "react";

export default function WaitListForm({setWaitListActive}: {setWaitListActive: Dispatch<SetStateAction<boolean>>}) {
    // Handle click outside modal
    const [subscriptionSucceed, setSubscriptionSucceed] = useState(false)
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setWaitListActive(false);
        }
    };

    const handleWaitListConfirmation = async () =>{
        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
        const email = emailInput?.value;
        const response: ApiResponseEnvelope = await subscribe(email)

        if (response.body.success == true){
            setSubscriptionSucceed(true)
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
            onClick={handleClickOutside}
        >
            {subscriptionSucceed ? (
                <div className="bg-black/90 p-6 rounded-lg shadow-2xl text-center w-96 border border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-200 mb-3">¡Felicidades!</h2>
                    <p className="text-gray-400">Tu correo ha sido agregado exitosamente a nuestra lista de espera.</p>
                    <p className="text-gray-500 mt-2">Te notificaremos cuando estemos listos.</p>
                </div>
            ) : (
                <div className="flex bg-black/90 p-8 rounded-xl shadow-2xl w-96 transform transition-all hover:scale-[1.02] duration-300 border border-blue-500 bg-gradient-to-r from-transparent to-transparent hover:from-black hover:to-blue-900/30">
                    <div className="w-full space-y-6">
                        <h3 className="text-2xl font-bold text-gray-200 mb-4">Únete a la lista de espera</h3>
                        <div className="relative">
                            <input 
                                type="email"
                                required
                                placeholder="correo@gmail.com"
                                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-700 transition-all duration-200 text-gray-300 outline-none placeholder-gray-600"
                            />
                        </div>
                        <button 
                            onClick={handleWaitListConfirmation}
                            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-200 font-bold px-6 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 border border-gray-700"
                        >
                            <span>Confirmar</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 animate-pulse" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}