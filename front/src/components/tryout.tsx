// import { ApiAuhResponse, authUser } from "@/lib/api";
// import { useGoogleLogin } from "@react-oauth/google";
// import { redirect } from 'next/navigation'
// import { useAuth } from "@/lib/auth";

import { useState } from "react"
import WaitListForm from "./waitlist"

export default function TryForFree({ setTryFree, tryFree}: { setTryFree: React.Dispatch<React.SetStateAction<boolean>>, tryFree: boolean }) {
    // const { login: contextLogin } = useAuth();
    const [waitListActive, setWaitListActive] = useState(false)
    const buttonBase = "px-5 py-2 m-2 rounded-full hover:opacity-75 transition-opacity duration-300 ease-in-out font-bold"
    const inactive = " hover:text-white bg-gray-800"
    const active = 'border border-white bg-white text-black'

    // const login = useGoogleLogin({
    //     onSuccess: async (codeResponse) => {
    //         try {
    //             const data: ApiAuhResponse = await authUser(codeResponse.code);
    //             localStorage.setItem('authToken', data.body.access_token);
    //             contextLogin();
    //             redirect("/dashboard")
    //         } catch (error) {
    //             console.error('Authentication error:', error);
    //         }
    //     },
    //     flow: 'auth-code',
    // });

    const waitList = () => {
        setWaitListActive(true)
    }
      
    return (
        <div className="text-center block mx-auto -mt-5">
            <button 
                className={`${buttonBase} ${active}`}
                onClick={() => {setTryFree(!tryFree)}}
            >
                Probar Versión Demo
            </button>
            <button 
                className={`${buttonBase} ${inactive}`}
                // onClick={() => login()}
                onClick={() => waitList()}
            >
                Unirse a Lista de Espera
            </button>
            {waitListActive && <WaitListForm setWaitListActive={setWaitListActive}  /> }
        </div>
    )

}