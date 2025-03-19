import React from 'react'
import {useNavigate} from "react-router-dom";

const Main = () => {
    const navigate  = useNavigate();
    return (
        <div className="flex justify-center items-center bg-[#e6e5e1] h-screen w-full flex-col">
            <img src="jess-4-cut-white-logo.png" alt="Jess 4 Cut" className="max-w-full max-h-full"/>
            <h1 className="font-mono mt-10 text-3xl" onClick = {() =>  navigate("/photo")}>Click to Take Photo</h1>
        </div>
    )
}
export default Main
