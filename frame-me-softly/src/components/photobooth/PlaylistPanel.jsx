import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music2, Heart, ExternalLink } from 'lucide-react';

const PLAYLIST = [
  { id: 1,  title: "I Wanna Be Yours",          artist: "Arctic Monkeys",          youtubeId: "hCTRaB79nY4", duration: "3:03", mood: "Intimate"   },
  { id: 2,  title: "Sweet Dreams, TN",           artist: "The Last Shadow Puppets", youtubeId: "5X-Mrc2l1d0", duration: "3:41", mood: "Dreamy"     },
  { id: 3,  title: "505",                        artist: "Arctic Monkeys",          youtubeId: "DDlkOpiTB_s", duration: "4:14", mood: "Longing"    },
  { id: 4,  title: "Do I Wanna Know?",           artist: "Arctic Monkeys",          youtubeId: "bpOSxM0rNPM", duration: "4:32", mood: "Sultry"     },
  { id: 5,  title: "The Night Will Always Win",  artist: "Manchester Orchestra",    youtubeId: "Q30WvVMMNNM", duration: "4:01", mood: "Cinematic"  },
  { id: 6,  title: "Fluorescent Adolescent",     artist: "Arctic Monkeys",          youtubeId: "78qfgqEE278", duration: "2:57", mood: "Nostalgic"  },
  { id: 7,  title: "Crying Lightning",           artist: "Arctic Monkeys",          youtubeId: "jhSaRMSFjzA", duration: "3:43", mood: "Romantic"   },
  { id: 8,  title: "Baby I'm Yours",             artist: "Arctic Monkeys",          youtubeId: "M3N1V0SF7Bs", duration: "2:42", mood: "Tender"     },
  { id: 9,  title: "Electricity",                artist: "The Last Shadow Puppets", youtubeId: "2TnlEHbk5Xg", duration: "3:39", mood: "Electric"   },
  { id: 10, title: "From the Ritz to the Rubble",artist: "Arctic Monkeys",          youtubeId: "lGllqumCLkU", duration: "3:54", mood: "Vintage"    },
];

const MOOD_COLORS = {
  Intimate:  '#b05468', Dreamy:    '#9b72b0', Longing:   '#a04050',
  Sultry:    '#b07040', Cinematic: '#5070a0', Nostalgic: '#a08840',
  Romantic:  '#b03850', Tender:    '#a06070', Electric:  '#4090a0',
  Vintage:   '#907040',
};

export default function PlaylistPanel({ playing, onToggle }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const current = PLAYLIST[currentIndex];

  // Load YouTube IFrame API once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = initPlayer;
  }, []);

  const initPlayer = () => {
    if (playerRef.current) return; // already created
    playerRef.current = new window.YT.Player('yt-player', {
      height: '100%',
      width: '100%',
      videoId: PLAYLIST[0].youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => setPlayerReady(true),
        onStateChange: (e) => {
          // YT.PlayerState.ENDED = 0
          if (e.data === 0) {
            setCurrentIndex((i) => (i + 1) % PLAYLIST.length);
          }
        },
      },
    });
  };

  // React to play/pause from parent
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    if (playing) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [playing, playerReady]);

  // Load new video when track changes
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    playerRef.current.loadVideoById(PLAYLIST[currentIndex].youtubeId);
    if (!playing) {
      // Auto-start on song selection
      setTimeout(() => playerRef.current?.playVideo(), 300);
    }
  }, [currentIndex]);

  const goTo = (idx) => {
    setCurrentIndex(idx);
    if (!playing) onToggle();
  };

  const prev = () => setCurrentIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  const next = () => setCurrentIndex((i) => (i + 1) % PLAYLIST.length);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div style={{ flex:1, height:1, background:'hsl(var(--gold) / 0.3)' }} />
        <Music2 size={11} className="text-gold/60" />
        <p className="font-playfair italic text-ivory/70 text-xs">Love Soundtrack</p>
        <div style={{ flex:1, height:1, background:'hsl(var(--gold) / 0.3)' }} />
      </div>

      {/* YouTube Player — visible, styled */}
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          border: '1px solid hsl(var(--wine) / 0.4)',
          boxShadow: '0 4px 24px hsl(var(--wine) / 0.2)',
          aspectRatio: '16/9',
          background: '#0d0406',
        }}
      >
        <div id="yt-player" ref={containerRef} className="w-full h-full" />

        {/* Overlay: now-playing info on top of player */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, rgba(13,4,6,0.85))' }}
        >
          <p className="font-playfair italic text-ivory/90 truncate" style={{ fontSize: 12 }}>
            {current.title}
          </p>
          <p className="font-montserrat text-muted-foreground truncate" style={{ fontSize: 9, letterSpacing: '0.08em' }}>
            {current.artist}
          </p>
        </div>

        {/* Mood badge */}
        <div className="absolute top-2 right-2 pointer-events-none">
          <span
            className="font-montserrat px-1.5 py-0.5 rounded-full"
            style={{
              fontSize: 8,
              background: `${MOOD_COLORS[current.mood]}33`,
              border: `1px solid ${MOOD_COLORS[current.mood]}66`,
              color: MOOD_COLORS[current.mood],
              letterSpacing: '0.1em',
              backdropFilter: 'blur(4px)',
            }}
          >
            {current.mood}
          </span>
        </div>
      </div>

      {/* Waveform + controls */}
      <div
        className="rounded-xl px-3 py-2.5 flex items-center gap-3"
        style={{
          background: 'hsl(350 25% 8% / 0.9)',
          border: '1px solid hsl(var(--wine) / 0.25)',
        }}
      >
        {/* Waveform */}
        <div className="flex items-end gap-px h-5 flex-shrink-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: `hsl(var(--wine-light) / ${playing ? 0.75 : 0.2})` }}
              animate={playing ? {
                height: [`${6 + Math.sin(i * 1.1) * 5}px`, `${14 + Math.cos(i * 0.9) * 5}px`, `${6 + Math.sin(i * 1.1) * 5}px`],
              } : { height: '4px' }}
              transition={{ duration: 0.7 + i * 0.06, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Prev */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prev}
          className="text-ivory/40 hover:text-ivory/80 transition-colors flex-shrink-0">
          <SkipBack size={14} />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-all duration-300"
          style={{
            background: playing ? 'linear-gradient(135deg, hsl(var(--wine-dark)), hsl(var(--wine)))' : 'hsl(var(--wine) / 0.12)',
            border: '1px solid hsl(var(--wine) / 0.5)',
            boxShadow: playing ? '0 0 16px hsl(var(--wine) / 0.4)' : 'none',
          }}
        >
          {playing ? <Pause size={13} className="text-ivory" /> : <Play size={13} className="text-ivory ml-0.5" />}
        </motion.button>

        {/* Next */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={next}
          className="text-ivory/40 hover:text-ivory/80 transition-colors flex-shrink-0">
          <SkipForward size={14} />
        </motion.button>

        {/* Song counter */}
        <span className="font-montserrat text-muted-foreground ml-auto flex-shrink-0" style={{ fontSize: 8, letterSpacing: '0.1em' }}>
          {String(currentIndex + 1).padStart(2,'0')} / {String(PLAYLIST.length).padStart(2,'0')}
        </span>
      </div>

      {/* Playlist list */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(350 20% 6% / 0.85)',
          border: '1px solid hsl(var(--wine) / 0.18)',
        }}
      >
        <div className="px-3 py-1.5 border-b border-wine/10">
          <p className="font-montserrat text-muted-foreground tracking-[0.2em]" style={{ fontSize: 8 }}>PLAYLIST — {PLAYLIST.length} SONGS</p>
        </div>
        <div style={{ maxHeight: 220, overflowY: 'auto' }}>
          {PLAYLIST.map((song, i) => (
            <motion.button
              key={song.id}
              onClick={() => goTo(i)}
              whileHover={{ backgroundColor: 'hsl(350 30% 11%)' }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors group relative
                ${i < PLAYLIST.length - 1 ? 'border-b' : ''}`}
              style={{
                borderColor: 'hsl(var(--wine) / 0.08)',
                background: i === currentIndex ? 'hsl(350 35% 12%)' : 'transparent',
              }}
            >
              {/* Number / bars */}
              <div className="w-4 flex-shrink-0 flex items-center justify-center">
                {i === currentIndex && playing ? (
                  <div className="flex items-end gap-px h-3">
                    {[0,1,2].map((b) => (
                      <motion.div key={b} className="w-0.5 rounded-full bg-wine-light"
                        animate={{ height: ['3px', '9px', '3px'] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: b * 0.12 }} />
                    ))}
                  </div>
                ) : (
                  <span className="font-montserrat text-muted-foreground/60" style={{ fontSize: 8 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-playfair italic truncate"
                  style={{ fontSize: 11, color: i === currentIndex ? 'hsl(var(--ivory))' : 'hsl(var(--foreground) / 0.65)' }}>
                  {song.title}
                </p>
                <p className="font-montserrat text-muted-foreground/60 truncate" style={{ fontSize: 8 }}>
                  {song.artist}
                </p>
              </div>

              <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                <span style={{ fontSize: 7, color: MOOD_COLORS[song.mood], letterSpacing: '0.05em', fontFamily: 'Montserrat, sans-serif' }}>
                  {song.mood}
                </span>
                <span className="font-montserrat text-muted-foreground/40" style={{ fontSize: 7 }}>{song.duration}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <p className="font-cormorant italic text-center text-muted-foreground/50" style={{ fontSize: 10 }}>
        "Every song is a memory waiting to be made"
      </p>
    </div>
  );
}