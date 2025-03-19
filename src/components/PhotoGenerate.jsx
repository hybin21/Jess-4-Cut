import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const PhotoGenerate = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [countdown, setCountdown] = useState(0);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);

    // Preset filter styles
    const filterPresets = {
        none: { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, invert: 0, saturate: 100, hueRotate: 0 },
        vintage: { brightness: 110, contrast: 90, sepia: 60, grayscale: 10, invert: 0, saturate: 80, hueRotate: 0 },
        cool: { brightness: 100, contrast: 120, sepia: 0, grayscale: 10, invert: 0, saturate: 120, hueRotate: 180 },
        warm: { brightness: 110, contrast: 90, sepia: 40, grayscale: 0, invert: 0, saturate: 120, hueRotate: 30 },
        dramatic: { brightness: 90, contrast: 150, sepia: 0, grayscale: 40, invert: 0, saturate: 80, hueRotate: 0 }
    };

    // State to manage filter selection and values
    const [selectedFilter, setSelectedFilter] = useState("none");
    const [filterValues, setFilterValues] = useState(filterPresets["none"]);

    // Update selected filter
    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setSelectedFilter(newFilter);
        setFilterValues(filterPresets[newFilter]); // Reset to preset values
    };

    // Update specific filter attributes
    const updateFilter = (filter, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [filter]: value,
        }));
    };

    // Generate CSS filter string for live preview
    const filterStyle = `
        brightness(${filterValues.brightness}%)
        contrast(${filterValues.contrast}%)
        grayscale(${filterValues.grayscale}%)
        sepia(${filterValues.sepia}%)
        invert(${filterValues.invert}%)
        saturate(${filterValues.saturate}%)
        hue-rotate(${filterValues.hueRotate}deg)
    `;

    const handleCapture = () => {
        if (capturedImages.length < 4 && !isTakingPhoto) {
            setIsTakingPhoto(true);
            setCountdown(5);

            let counter = 5;
            const interval = setInterval(() => {
                counter -= 1;
                setCountdown(counter);

                if (counter === 0) {
                    clearInterval(interval);
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
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 750;
        canvas.height = 1125;

        const background = new Image();
        background.src = "blue-bg.png"; // Ensure this path is correct
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
                    ctx.filter = `
                        brightness(${filterValues.brightness}%)
                        contrast(${filterValues.contrast}%)
                        grayscale(${filterValues.grayscale}%)
                        sepia(${filterValues.sepia}%)
                        invert(${filterValues.invert}%)
                        saturate(${filterValues.saturate}%)
                        hue-rotate(${filterValues.hueRotate}deg)
                    `;
                    ctx.drawImage(img, positions[index].x, positions[index].y, 320, 460);
                    imagesLoaded++;

                    if (imagesLoaded === 4) {
                        const link = document.createElement("a");
                        const timestamp = Date.now();
                        link.href = canvas.toDataURL("image/png", 1.0);
                        link.download = `jess-4-cut-${timestamp}.png`;
                        link.click();
                    }
                };
            });
        };
    };

    return (
        <div className="flex">
            {/* Sidebar for Filter Selection & Adjustments */}
            <div className="w-64 p-4 bg-gray-200 min-h-screen">
                <h2 className="text-lg font-bold mb-4">Select & Customize Filter</h2>

                {/* Overall Filter Selection Dropdown */}
                <label className="block mb-2 font-bold">Choose a Filter:</label>
                <select
                    className="mb-4 p-2 border rounded w-full"
                    value={selectedFilter}
                    onChange={handleFilterChange}
                >
                    <option value="none">None</option>
                    <option value="vintage">Vintage</option>
                    <option value="cool">Cool</option>
                    <option value="warm">Warm</option>
                    <option value="dramatic">Dramatic</option>
                </select>

                {/* Adjustment Sliders */}
                <label className="block mb-2">Brightness: {filterValues.brightness}%</label>
                <input type="range" min="50" max="200" value={filterValues.brightness} onChange={(e) => updateFilter("brightness", e.target.value)} className="w-full mb-4" />

                <label className="block mb-2">Contrast: {filterValues.contrast}%</label>
                <input type="range" min="50" max="200" value={filterValues.contrast} onChange={(e) => updateFilter("contrast", e.target.value)} className="w-full mb-4" />

                <label className="block mb-2">Grayscale: {filterValues.grayscale}%</label>
                <input type="range" min="0" max="100" value={filterValues.grayscale} onChange={(e) => updateFilter("grayscale", e.target.value)} className="w-full mb-4" />

                <label className="block mb-2">Sepia: {filterValues.sepia}%</label>
                <input type="range" min="0" max="100" value={filterValues.sepia} onChange={(e) => updateFilter("sepia", e.target.value)} className="w-full mb-4" />

                <label className="block mb-2">Invert: {filterValues.invert}%</label>
                <input type="range" min="0" max="100" value={filterValues.invert} onChange={(e) => updateFilter("invert", e.target.value)} className="w-full mb-4" />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center p-4 flex-grow">
                {/* Webcam Capture with Live Filter Preview */}
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
                    className="w-[320px] h-[460px] rounded-md border"
                    style={{ filter: filterStyle }} // Apply dynamic filter
                />

                {/* Countdown Display */}
                {countdown > 0 && <p className="text-2xl font-bold mt-2">Capturing in {countdown}...</p>}

                {/* Capture Photo Button */}
                <button
                    onClick={handleCapture}
                    className={`mt-4 p-2 rounded text-white ${isTakingPhoto ? 'bg-gray-500' : 'bg-blue-500'}`}
                    disabled={isTakingPhoto}
                >
                    {isTakingPhoto ? "Waiting..." : `Capture Photo (${capturedImages.length}/4)`}
                </button>
                {capturedImages.length === 4 && (
                    <div className = "flex flex-col items-center">
                        <div className="mt-4 relative w-[750px] h-[1125px]" ref={canvasRef}>
                            <img src="blue-bg.png" alt="Frame" className="absolute w-full h-full" />
                            {capturedImages.map((image, index) => {
                                const positions = [
                                    { top: "47px", left: "41px" },
                                    { top: "47px", left: "390px" },
                                    { top: "535px", left: "41px" },
                                    { top: "535px", left: "390px" }
                                ];

                                return (
                                    <img
                                        key={index}
                                        src={image}
                                        className="absolute"
                                        style={{
                                            ...positions[index],
                                            width: "320px",
                                            height: "460px",
                                            objectFit: "cover",
                                            filter: filterStyle, // Apply filter to captured images
                                        }}
                                        alt={`Captured ${index + 1}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Download Button */}
                {capturedImages.length === 4 && (
                    <button onClick={handleDownload} className="mt-4 p-2 bg-green-500 text-white rounded">
                        Download Framed Photo
                    </button>
                )}
            </div>
        </div>
    );
};

export default PhotoGenerate;
