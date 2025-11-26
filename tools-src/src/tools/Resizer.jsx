import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, ZoomIn, ZoomOut, Move, RefreshCcw, Image as ImageIcon } from 'lucide-react';

export default function Resizer() {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageObj, setImageObj] = useState(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [processing, setProcessing] = useState(false);

    // The target dimension
    const TARGET_SIZE = 1024;
    // Visual display size (scaled down via CSS, but logic uses target coordinates)
    const displaySize = 350; // px for the preview box on screen

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                setImageObj(img);
                setImageSrc(url);

                // Calculate initial scale to fit "cover" style
                const scaleX = TARGET_SIZE / img.width;
                const scaleY = TARGET_SIZE / img.height;
                const newScale = Math.max(scaleX, scaleY);

                setScale(newScale);

                // Center the image
                const scaledWidth = img.width * newScale;
                const scaledHeight = img.height * newScale;

                setPosition({
                    x: (TARGET_SIZE - scaledWidth) / 2,
                    y: (TARGET_SIZE - scaledHeight) / 2
                });
            };
            img.src = url;
        }
    };

    const handleMouseDown = (e) => {
        if (!imageSrc) return;
        setIsDragging(true);
        // Calculate start position relative to the container
        // We need to account for the fact that the container is smaller visually than the logical TARGET_SIZE
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        setDragStart({
            x: clientX - position.x * (displaySize / TARGET_SIZE),
            y: clientY - position.y * (displaySize / TARGET_SIZE)
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !imageSrc) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Calculate delta in visual pixels
        // Then map back to logical pixels (Target Size space)
        const ratio = TARGET_SIZE / displaySize;

        const newX = (clientX - dragStart.x) * ratio;
        const newY = (clientY - dragStart.y) * ratio;

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        if (!imageSrc) return;
        // Simple zoom on scroll
        const delta = -Math.sign(e.deltaY) * 0.1;
        const newScale = Math.max(0.1, Math.min(scale + delta, 10));
        setScale(newScale);
    };

    const handleDownload = async () => {
        if (!imageObj) return;
        setProcessing(true);

        // Give UI a moment to update state
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;
            const ctx = canvas.getContext('2d');

            // Fill background (optional, in case image doesn't cover)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

            // Draw image with current transforms
            ctx.drawImage(
                imageObj,
                position.x,
                position.y,
                imageObj.width * scale,
                imageObj.height * scale
            );

            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resized-image-1024x1024.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setProcessing(false);
            }, 'image/png', 1.0);
        }, 100);
    };

    const centerImage = () => {
        if (!imageObj) return;
        const scaleX = TARGET_SIZE / imageObj.width;
        const scaleY = TARGET_SIZE / imageObj.height;
        const newScale = Math.max(scaleX, scaleY); // Cover

        setScale(newScale);
        setPosition({
            x: (TARGET_SIZE - imageObj.width * newScale) / 2,
            y: (TARGET_SIZE - imageObj.height * newScale) / 2
        });
    };

    return (
        <div className="flex flex-col items-center p-4 md:p-8 font-sans">

            <div className="max-w-2xl w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">

                {/* Header */}
                <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            1024x1024 Resizer
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Scale, crop, and export.</p>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-lg shadow-indigo-900/20"
                    >
                        <Upload size={16} />
                        {imageSrc ? 'Change Image' : 'Upload Image'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Main Work Area */}
                <div className="p-8 flex flex-col items-center gap-8">

                    {/* Viewport Container */}
                    <div
                        className="relative group cursor-move select-none shadow-2xl rounded-sm ring-1 ring-slate-600 overflow-hidden bg-slate-950"
                        style={{
                            width: displaySize,
                            height: displaySize,
                            touchAction: 'none' // Prevent scrolling on touch
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchEnd={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        {!imageSrc ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950"
                            >
                                <ImageIcon size={48} className="mb-4 opacity-50" />
                                <p className="font-medium">Drop or Click to Upload</p>
                                <p className="text-xs mt-2 opacity-50">Target: 1024 x 1024</p>
                            </div>
                        ) : (
                            <>
                                {/* The Image Layer */}
                                <div
                                    style={{
                                        transformOrigin: 'top left',
                                        transform: `scale(${displaySize / TARGET_SIZE})`, // Scale everything down to view size
                                        width: TARGET_SIZE,
                                        height: TARGET_SIZE,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        pointerEvents: 'none' // Let events pass to parent
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                        transformOrigin: 'top left',
                                        willChange: 'transform'
                                    }}>
                                        <img
                                            src={imageSrc}
                                            alt="Preview"
                                            draggable={false}
                                            className="max-w-none"
                                        />
                                    </div>
                                </div>

                                {/* Grid Overlay for Visual Aid */}
                                <div className="absolute inset-0 pointer-events-none border border-white/10">
                                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10"></div>
                                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10"></div>
                                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10"></div>
                                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10"></div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Controls */}
                    <div className={`w-full max-w-sm space-y-6 transition-opacity duration-300 ${!imageSrc ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                        {/* Zoom Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <span>Zoom Level</span>
                                <span>{(scale * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <ZoomOut size={18} className="text-slate-500" />
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5"
                                    step="0.01"
                                    value={scale}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                                />
                                <ZoomIn size={18} className="text-slate-500" />
                            </div>
                        </div>

                        {/* Hint */}
                        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <Move size={14} />
                                <span>Drag image to position</span>
                            </div>
                            <button
                                onClick={centerImage}
                                className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                            >
                                <RefreshCcw size={10} /> Reset
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={handleDownload}
                            disabled={!imageSrc || processing}
                            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95
                ${!imageSrc
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-900/20'
                                }
              `}
                        >
                            {processing ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    <Download size={20} />
                                    Download 1024x1024 PNG
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <p className="mt-8 text-slate-500 text-xs text-center max-w-md">
                Images are processed locally in your browser. No data is uploaded to any server.
            </p>

        </div>
    );
}
