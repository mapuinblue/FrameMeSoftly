export const FILTERS = {
  'vintage-warm': {
    label: 'Vintage Warm',
    css: 'sepia(0.5) contrast(1.1) brightness(0.9) saturate(0.8) hue-rotate(10deg)',
    overlay: 'rgba(180, 100, 40, 0.12)',
    grain: 0.04,
  },
  'retro-flash': {
    label: 'Retro Flash',
    css: 'contrast(1.3) brightness(1.05) saturate(0.6) sepia(0.3)',
    overlay: 'rgba(255, 240, 200, 0.15)',
    grain: 0.06,
  },
  'film-grain': {
    label: 'Film Grain',
    css: 'grayscale(0.3) contrast(1.15) brightness(0.92) sepia(0.2)',
    overlay: 'rgba(0,0,0,0.1)',
    grain: 0.09,
  },
  'soft-bloom': {
    label: 'Soft Bloom',
    css: 'brightness(1.08) saturate(1.2) contrast(0.9) blur(0.3px)',
    overlay: 'rgba(255, 220, 230, 0.12)',
    grain: 0.02,
  },
  '2000s-digital': {
    label: '2000s Digital',
    css: 'saturate(1.4) contrast(1.1) brightness(0.95) hue-rotate(-5deg)',
    overlay: 'rgba(100, 200, 255, 0.06)',
    grain: 0.07,
  },
  'polaroid-fade': {
    label: 'Polaroid Fade',
    css: 'sepia(0.35) contrast(0.9) brightness(1.05) saturate(0.75)',
    overlay: 'rgba(220, 200, 160, 0.18)',
    grain: 0.05,
  },
  'bw-elegant': {
    label: 'B&W Elegant',
    css: 'grayscale(1) contrast(1.2) brightness(0.88)',
    overlay: 'rgba(0,0,0,0.08)',
    grain: 0.06,
  },
  'dreamy-red': {
    label: 'Dreamy Red',
    css: 'saturate(1.3) contrast(1.05) brightness(0.88) hue-rotate(-15deg) sepia(0.2)',
    overlay: 'rgba(140, 0, 30, 0.14)',
    grain: 0.04,
  },
};