import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, ZapOff } from 'lucide-react';
import FilterSelector from './FilterSelector';
import { FILTERS } from './filters';

export default function CameraView({
  onCapture,
  isCapturing,
  selectedFilter,
  setSelectedFilter,
  flashEnabled,
  setFlashEnabled,
  isFull,
  photosCount,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let stream;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
          };
        }
      } catch {
        setCameraError(true);
      }
    })();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const takePicture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  const filter = FILTERS[selectedFilter];

  return (
    <div className="flex flex-col gap-4">

      {/* CAMERA FRAME */}
      <div className="relative">

        {/* OUTER GLOW */}
        <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-wine via-wine-dark to-wine-light opacity-70 blur-[1px]" />

        {/* MAIN FRAME */}
        <div
          className="relative rounded-2xl overflow-hidden camera-border bg-black"
          style={{
            aspectRatio: '4/3',
            minWidth: 320,
            maxWidth: 500,
            width: '100%',
          }}
        >

          {/* VIDEO */}
          {!cameraError && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: 'scaleX(-1)',
                filter: filter?.css || 'none',
                opacity: cameraReady ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />
          )}

          {/* LOADING */}
          {!cameraReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d0406] z-20">
              <div className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
            </div>
          )}

          {/* CAMERA ERROR */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0406] text-ivory/40 z-20">
              <Camera size={40} className="mb-3 text-wine/50" />

              <p className="font-cormorant text-lg italic">
                Camera access required
              </p>

              <p className="font-montserrat text-xs mt-1 text-ivory/30">
                Please allow camera permissions
              </p>
            </div>
          )}

          {/* FILTER OVERLAY */}
          {filter?.overlay && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply z-10"
              style={{
                background: filter.overlay,
              }}
            />
          )}

          {/* VIEWFINDER */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(transparent 49.5%, rgba(255,255,255,0.03) 49.5%, rgba(255,255,255,0.03) 50.5%, transparent 50.5%), linear-gradient(90deg, transparent 49.5%, rgba(255,255,255,0.03) 49.5%, rgba(255,255,255,0.03) 50.5%, transparent 50.5%)',
            }}
          />

          {/* VIGNETTE */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.65)',
            }}
          />

          {/* CORNERS */}
          {[
            'top-0 left-0',
            'top-0 right-0',
            'bottom-0 left-0',
            'bottom-0 right-0',
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-6 h-6 z-20 pointer-events-none`}
            >
              <div
                className={`absolute w-4 h-4 border-wine-light
                ${
                  i === 0
                    ? 'border-t-2 border-l-2 top-1 left-1'
                    : i === 1
                    ? 'border-t-2 border-r-2 top-1 right-1'
                    : i === 2
                    ? 'border-b-2 border-l-2 bottom-1 left-1'
                    : 'border-b-2 border-r-2 bottom-1 right-1'
                }`}
              />
            </div>
          ))}

          {/* PHOTO COUNTER */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < photosCount
                    ? 'bg-wine-light'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* QUOTE — INSIDE REAL EMPTY SPACE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 2 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 text-center px-6 pointer-events-none"
          >
            <p
              className="font-cormorant italic text-ivory/80"
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.5,
                textShadow: '0 2px 10px rgba(0,0,0,0.95)',
              }}
            >
              “Some memories stay alive
              <br />
              long after the moment ends.”
            </p>

            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gold/20" />

              <span className="text-[9px] tracking-[0.35em] text-gold/40 font-montserrat">
                FOREVER
              </span>

              <div className="h-px w-8 bg-gold/20" />
            </div>
          </motion.div>

        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* CONTROLS */}
      <div className="flex flex-col gap-3">

        {/* CAPTURE BUTTON */}
        <motion.button
          whileHover={!isCapturing && !isFull ? { scale: 1.02 } : {}}
          whileTap={!isCapturing && !isFull ? { scale: 0.97 } : {}}
          onClick={() => onCapture(takePicture)}
          disabled={isCapturing || isFull}
          className={`btn-elegant w-full py-3.5 rounded-xl font-playfair text-lg italic tracking-wide transition-all duration-300 relative overflow-hidden
          ${
            isCapturing || isFull
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-to-r from-wine-dark via-wine to-wine-light text-ivory wine-glow hover:shadow-2xl cursor-pointer'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Camera size={18} />

            {isFull
              ? 'Strip Complete'
              : isCapturing
              ? 'Capturing...'
              : 'Capture'}
          </span>
        </motion.button>

        {/* SECONDARY CONTROLS */}
        <div className="flex gap-2">

          {/* FLASH */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFlashEnabled(!flashEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-montserrat tracking-wider transition-all duration-300
            ${
              flashEnabled
                ? 'border-gold/50 text-gold bg-gold/5'
                : 'border-border text-muted-foreground'
            }`}
          >
            {flashEnabled ? <Zap size={13} /> : <ZapOff size={13} />}

            Flash
          </motion.button>

          {/* SHOTS LEFT */}
          <div className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border/50 px-3 py-2">
            <span className="font-montserrat text-xs text-muted-foreground tracking-wider">
              {3 - photosCount} shot
              {3 - photosCount !== 1 ? 's' : ''} left
            </span>
          </div>

        </div>

        {/* FILTERS */}
        <FilterSelector
          selected={selectedFilter}
          onSelect={setSelectedFilter}
          filters={FILTERS}
        />

      </div>
    </div>
  );
}