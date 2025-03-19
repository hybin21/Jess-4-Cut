import React, {useState,useEffect} from 'react'

const LoadingScreen = ({onComplete}) => {
    const [text, setText] = useState("");
    const fullText = "<Downloading ~/>";
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0,index));
            index++;
            if(index > fullText.length){
                clearInterval(interval);
                setTimeout(()=>{
                    onComplete();
                },100);
            }
        },100);
        return () => clearInterval(interval);
    },[onComplete])

    return (
        <div className = "fixed inset-0 z-50 bg-[#e6e5e1] text-black flex flex-col items-center justify-center">
            <div className = "mb-4 text-4xl font-mono font-bold">
                {text} <span className = "animate-blick ml-1">|</span>
            </div>
            <div className = "w-[200px] h-[2px] bg-black/30 rounded relative oveflow-hidden">
                <div className = "w-[40%] h-full bg-black shadow-[0_0_15px_#162230] animate-loading-bar"/>
            </div>

        </div>

    )
}
export default LoadingScreen
