import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import LoadingScreen from "./LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";
import CameraSound from "/camera-capture-sound.mp3";

const PhotoGenerate = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [countdown, setCountdown] = useState(0);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [filterbarOpened, setFilterbarOpened] = useState(false);
    const [frameColor, setFrameColor] = useState("#696B80");  // State to track selected frame color
    const [framePath, setFramePath] = useState("blue-bg.png");
    const [logoImgPath, setLogoImgPath] = useState("jess-4-cut-blue-logo.png");
    const [backgroundColor, setBackgroundColor] = useState("#3b3c47");
    const frames = [
        {name: 'Blue', src: 'blue-bg.png', color: '#696B80',logo:'jess-4-cut-blue-logo.png', background:'#3b3c47'},
        { name: 'Green', src: 'green-bg.png', color: '#4B7374' ,logo:'jess-4-cut-green-logo.png', background:'#264747'},
        { name: 'Lavender', src: 'lavender-bg.png', color: '#A6A3C2' ,logo:'jess-4-cut-lavender-logo.png', background:'#504e5e'},
        { name: 'Pink', src: 'pink-bg.png', color: '#E5B8D0' ,logo:'jess-4-cut-pink-logo.png', background:'#876c7b'},
        { name:'White', src: 'white-bg.png', color: '#FFFFFF' ,logo:'jess-4-cut-white-logo.png', background:'#e6e5e1'},
        { name:'Red', src: 'red-bg.png', color: '#A03F3F',logo:'jess-4-cut-red-logo.png', background:'#693838' },
        { name:'Yellow', src: 'yellow-bg.png', color: '#E4DAA6' ,logo:'jess-4-cut-yellow-logo.png', background:'#827c5e'},
        { name:'Black', src: 'black-bg.png', color: '#000000' ,logo:'jess-4-cut-black-logo.png', background:'#292929'},
    ];
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleFrameChange = (color, src, logo, bg) => {
        setFrameColor(color);
        setFramePath(src);
        setLogoImgPath(logo);
        setBackgroundColor(bg);

    };
    // Preset filter styles
    const filterPresets = {
        none: { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, invert: 0, saturate: 100, hueRotate: 0 },
        vintage: { brightness: 110, contrast: 90, sepia: 60, grayscale: 10, invert: 0, saturate: 80, hueRotate: 0 },
        cool: { brightness: 100, contrast: 120, sepia: 0, grayscale: 10, invert: 0, saturate: 120, hueRotate: 180 },
        warm: { brightness: 110, contrast: 90, sepia: 40, grayscale: 0, invert: 0, saturate: 120, hueRotate: 30 },
        dramatic: { brightness: 90, contrast: 150, sepia: 0, grayscale: 40, invert: 0, saturate: 80, hueRotate: 0 }
    };

    const [selectedFilter, setSelectedFilter] = useState("none");
    const [filterValues, setFilterValues] = useState(filterPresets["none"]);

    // Update selected filter
    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setSelectedFilter(newFilter);
        setFilterValues(filterPresets[newFilter]);
    };

    // Update specific filter attributes
    const updateFilter = (filter, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [filter]: value,
        }));
    };

    const resetFilter = () => {
        setSelectedFilter("none");
        setFilterValues(filterPresets["none"]);
    }

    const filterStyle = `
        brightness(${filterValues.brightness}%)
        contrast(${filterValues.contrast}%)
        grayscale(${filterValues.grayscale}%)
        sepia(${filterValues.sepia}%)
        invert(${filterValues.invert}%)
        saturate(${filterValues.saturate}%)
        hue-rotate(${filterValues.hueRotate}deg)
    `;
    const playSound = () => {
        const clickSound =  new Audio(CameraSound);
        clickSound.play();
    }
    const handleCapture = () => {
        if (capturedImages.length < 4 && !isTakingPhoto) {
            setIsTakingPhoto(true);
            setCountdown(3);

            // play the camera click sound


            let counter = 3;
            const interval = setInterval(() => {
                counter -= 1;
                setCountdown(counter);
                if (counter === 0) {
                    clearInterval(interval);
                    playSound();
                    const imageSrc = webcamRef.current.getScreenshot();
                    setCapturedImages([...capturedImages, imageSrc]);
                    setIsTakingPhoto(false);

                }
            }, 1000);
        } else {
            alert("You have already taken 4 photos!");
        }
    };

    const handleDownload = () => {
        setIsLoading(true); // Show the loading screen when the download starts

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 750;
        canvas.height = 1125;

        const background = new Image();
        background.src = framePath; // Use the selected frame background
        background.onload = () => {
            ctx.drawImage(background, 0, 0, 750, 1125);

            const positions = [
                { x: 41, y: 47 },
                { x: 390, y: 47 },
                { x: 41, y: 535 },
                { x: 390, y: 535 }
            ];

            let imagesLoaded = 0;
            capturedImages.forEach((imgSrc, index) => {
                const img = new Image();
                img.src = imgSrc;
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    ctx.drawImage(img, positions[index].x, positions[index].y, 320, 460);
                    imagesLoaded++;

                    if (imagesLoaded === 4) {
                        const link = document.createElement("a");
                        const timestamp = Date.now();
                        link.href = canvas.toDataURL("image/png", 1.0);
                        link.download = `jess-4-cut-${timestamp}.png`;
                        link.click();

                        setTimeout(() => {
                            setIsLoading(false); // Hide the loading screen after 7 seconds
                            setCapturedImages([]);
                            setCountdown(0);
                            setIsTakingPhoto(false);
                        }, 1500);
                    }
                };
            });
        };
    };

    useEffect(() => {
        document.body.style.backgroundColor = `${backgroundColor}80`;
    },[backgroundColor]);


    return (
        <div className="flex min-w-[100vw] min-h-[100vh]"
             style={{ backgroundColor: `${backgroundColor}80` }}>
            {/* Loading Screen */}
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* Sidebar for Filter Selection & Adjustments */}
            {filterbarOpened ? (
                <div className={`w-64 p-4 ml-2 mt-2  h-full rounded-2xl font-mono ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "text-black border-black" : "text-white border-white"}  border-2  `}
                     style={{ backgroundColor: frameColor ? `${frameColor}80` : "#696B80" }}>
                    {/* Close Filter Sidebar Button */}
                    <div className="flex items-center mb-4">
                        <h1 className={`text-2xl cursor-pointer  hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`} onClick={() => setFilterbarOpened(false)}>x</h1>
                        <h2 className="text-lg font-bold mx-auto">Filter</h2>
                    </div>

                    {/* Filter Selection Dropdown */}
                    <label className="block mb-2">Choose a Filter:</label>
                    <select
                        className="mb-4 p-2 border rounded w-full  hover:-translate-y-1 hover:fill-black hover:shadow-gray-800"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                    >
                        <option value="none">None</option>
                        <option value="vintage">Vintage</option>
                        <option value="cool">Cool</option>
                        <option value="warm">Warm</option>
                        <option value="dramatic">Dramatic</option>
                    </select>

                    {/* Filter Adjustments */}
                    <div className="mb-4">
                        {/* Contrast */}
                        <label className="block">Contrast</label>
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => updateFilter("contrast", Math.max(filterValues.contrast - 10, 50))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                               -
                            </button>
                            <span className="mx-4">{filterValues.contrast}%</span>
                            <button
                                onClick={() => updateFilter("contrast", Math.min(filterValues.contrast + 10, 150))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                +
                            </button>
                        </div>

                        {/* Grayscale */}
                        <label className="block">Grayscale</label>
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => updateFilter("grayscale", Math.max(filterValues.grayscale - 10, 0))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                -
                            </button>
                            <span className="mx-4">{filterValues.grayscale}%</span>
                            <button
                                onClick={() => updateFilter("grayscale", Math.min(filterValues.grayscale + 10, 100))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                +
                            </button>
                        </div>

                        {/* Sepia */}
                        <label className="block">Sepia</label>
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => updateFilter("sepia", Math.max(filterValues.sepia - 10, 0))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                -
                            </button>
                            <span className="mx-4">{filterValues.sepia}%</span>
                            <button
                                onClick={() => updateFilter("sepia", Math.min(filterValues.sepia + 10, 100))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                +
                            </button>
                        </div>
                        {/* Invert */}
                        <label className="block">Invert</label>
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => updateFilter("invert", Math.max(filterValues.invert - 10, 0))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                -
                            </button>
                            <span className="mx-4">{filterValues.invert}%</span>
                            <button
                                onClick={() => updateFilter("invert", Math.min(filterValues.invert + 10, 100))}
                                className={`p-2 hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-white" : "hover:text-black"}`}
                            >
                                +
                            </button>
                        </div>
                        <button onClick = {resetFilter} className={`p-2  hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-800 rounded-2xl ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "hover:text-black text-white bg-black hover:bg-white" : "hover:text-white text-black bg-white hover:bg-black"} ` }>Reset</button>
                    </div>

                    {/* Frame Selection */}
                    <label className="block mb-2">Frame Color:</label>
                    <div className="flex flex-wrap">
                        {frames.map((frame) => (
                            // ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "border-black" : "border-white"} border-2
                            <button
                                key={frame.name}
                                style={{ backgroundColor: frame.color }}
                                className={`mb-4 mr-4 p-2 rounded ${frame.name === "White" || frame.name === "Yellow" || frame.name === "Pink" ? "text-black " : "text-white"} border-2 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? ` border-black` : `border-white`} hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-800`}
                                onClick={() => handleFrameChange(frame.color, frame.src, frame.logo,frame.background)}

                            >
                                {frame.name}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 fixed">
                    <button onClick={() => setFilterbarOpened(true)}
                            className={`p-2 rounded-2xl  ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? `text-black border-black` : `text-white border-white`}  border-2 hover:shadow-2xl hover:shadow-gray-800`}
                            style={{ backgroundColor: frameColor }}
                           >
                        Filter
                    </button>
                </div>
            )}


            {/* Main Content */}
            <div className="flex flex-col  items-center p-4 flex-grow">


                {/* Webcam Capture with Live Filter Preview */}

                {capturedImages.length < 4 ?(
                    <div>
                        <img src={logoImgPath} alt="Jess 4 cut" onClick={() => navigate("/")} className="mb-4" />
                        <div
                            className={`flex justify-center items-center rounded-2xl p-8 w-[400px] h-[540px] bg-white/50 mt-40 hover:shadow-2xl hover:shadow-gray-800 hover:-translate-y-1
                            ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "border-black" : "border-white"} border-2`}
                            style={{ backgroundColor: frameColor ? `${frameColor}80` : "#696B80" }}
                        >
                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/png"
                                videoConstraints={{
                                    width: 320,
                                    height: 460,
                                    aspectRatio: 320 / 460,
                                    facingMode: "user",
                                }}
                                mirrored={true}
                                className="w-[320px] h-[460px] rounded-2xlbg-[#183159]/30"
                                style={{ filter: filterStyle }}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            {countdown > 0 && (
                                <p className={`text-3xl font-mono mt-12 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "text-black" : "text-white"}`}>{countdown}</p>
                            )}
                        </div>
                        {!isTakingPhoto && (
                            <div className="flex justify-center items-center flex-col mt-4">
                                {/* Capture Button */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="100"
                                    height="100"
                                    viewBox="0 0 50 50"
                                    onClick={handleCapture}
                                    className={`p-2  hover:-translate-y-1 ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "fill-black hover:fill-white" : "fill-white hover:fill-black"}`}
                                >
                                    <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z"></path>
                                </svg>
                                <p className={`font-mono text-2xl ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "text-black" : "text-white"}`}>Captured: {capturedImages.length}</p>
                            </div>
                        )}
                    </div>
                    ): (
                    <div className="flex flex-col items-center">
                        <h1 className={`text-3xl ${frameColor === "#FFFFFF" || frameColor === "#E4DAA6" || frameColor === "#E5B8D0" ? "text-black" : "text-white"} font-mono`}>Image Preview</h1>
                        <div className="mt-4 relative w-[650px] h-[975px]  hover hover:-traslate-y-1 hover:shadow-2xl hover:shadow-gray-800"
                             ref={canvasRef}
                             onClick={handleDownload}>
                            <img
                                src={framePath}
                                alt="Frame"
                                className="absolute w-full h-full hover hover:shadow-2xl hover:shadow-black hover:-translate-y-1"
                            />
                            {capturedImages.map((image, index) => {
                                const positions = [
                                    { top: "38px", left: "35px" },
                                    { top: "38px", left: "335px" },
                                    { top: "458px", left: "35px" },
                                    { top: "458px", left: "335px" }
                                ];

                                return (
                                    <img
                                        key={index}
                                        src={image}
                                        className="absolute"
                                        style={{
                                            ...positions[index],
                                            width: "280px",  // Adjusted size
                                            height: "400px", // Adjusted size
                                            objectFit: "cover",
                                            filter: filterStyle,
                                        }}
                                        alt={`Captured ${index + 1}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoGenerate;