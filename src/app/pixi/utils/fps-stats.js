export default class FPSStatsHelper {
  constructor() {
    this.meter = new FPSMeter({
      interval: 100,     // Update interval in milliseconds.
      smoothing: 10,      // Spike smoothing strength. 1 means no smoothing.
      show: 'fps',   // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
      toggleOn: 'click', // Toggle between show 'fps' and 'ms' on this event.
      decimals: 1,       // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
      maxFps: 60,      // Max expected FPS value.
      threshold: 100,     // Minimal tick reporting interval in milliseconds.

      // Meter position
      position: 'absolute', // Meter position.
      zIndex: 10,         // Meter Z index.
      left: '5px',      // Meter left offset.
      top: '5px',      // Meter top offset.
      right: 'auto',     // Meter right offset.
      bottom: 'auto',     // Meter bottom offset.
      margin: '0 0 0 0',  // Meter margin. Helps with centering the counter when left: 50%;

      // Theme
      theme: 'colorful', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
      heat: 1,      // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.

      // Graph
      graph: 1, // Whether to show history graph.
      history: 20 // How many history states to show in a graph.
    });
    return this;
  }

  tickStart() {
    this.meter.tickStart();
  }

  tickEnd() {
    this.meter.tick();
  }

  static init() {
    FPSMeter.theme.colorful = {
      heatmaps: [
        {
          saturation: 0.5,
          lightness: 0.6
        }
      ],
      container: {
        // Settings
        heatOn: 'backgroundColor',

        // Styles
        padding: '5px',
        minWidth: '95px',
        height: '30px',
        lineHeight: '30px',
        textAlign: 'right',
        background: '#753faa',
        border: '1px solid #ccc',
        borderColor: 'rgba(0,0,0,0.1)',
        color: '#0dff06',
        textShadow: '1px 1px 0 rgba(0,0,0,.2)'
      },
      count: {
        // Styles
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '5px 10px',
        height: '30px',
        fontSize: '24px',
        fontFamily: 'Consolas, Andale Mono, monospace',
        zIndex: 2
      },
      legend: {
        // Styles
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '5px 10px',
        height: '30px',
        fontSize: '12px',
        lineHeight: '32px',
        fontFamily: 'sans-serif',
        textAlign: 'left',
        float: 'left',
        zIndex: 2
      },
      graph: {
        // Styles
        position: 'relative',
        boxSizing: 'padding-box',
        MozBoxSizing: 'padding-box',
        height: '100%',
        zIndex: 1
      },
      column: {
        // Settings
        width: 4,
        spacing: 1,

        // Styles
        background: '#777',
        backgroundColor: 'rgba(0,0,0,.2)'
      }
    };
  }
}