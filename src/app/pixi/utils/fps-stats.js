export default class FPSStatsHelper {
  constructor() {
    //this.init();
  }

  init() {
    FPSMeter.theme.colorful = {
      heatmaps: [
        {
          saturation: 0.5,
          lightness: 0.6
        }
      ],
      container: {
        // Settings
        heatOn: "backgroundColor",

        // Styles
        padding: "5px",
        minWidth: "95px",
        height: "30px",
        lineHeight: "30px",
        textAlign: "right",
        background: "#753faa",
        border: "1px solid #ccc",
        borderColor: "rgba(0,0,0,0.1)",
        color: "#0dff06",
        textShadow: "1px 1px 0 rgba(0,0,0,.2)"
      },
      count: {
        // Styles
        position: "absolute",
        top: 0,
        right: 0,
        padding: "5px 10px",
        height: "30px",
        fontSize: "24px",
        fontFamily: "Consolas, Andale Mono, monospace",
        zIndex: 2
      },
      legend: {
        // Styles
        position: "absolute",
        top: 0,
        left: 0,
        padding: "5px 10px",
        height: "30px",
        fontSize: "12px",
        lineHeight: "32px",
        fontFamily: "sans-serif",
        textAlign: "left",
        float: "left",
        zIndex: 2
      },
      graph: {
        // Styles
        position: "relative",
        boxSizing: "padding-box",
        MozBoxSizing: "padding-box",
        height: "100%",
        zIndex: 1
      },
      column: {
        // Settings
        width: 4,
        spacing: 1,

        // Styles
        background: "#777",
        backgroundColor: "rgba(0,0,0,.2)"
      }
    };
  }
}