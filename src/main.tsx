import { createRoot, Root } from "react-dom/client";
import { App } from "./components/app.js";

declare global {
  function define<S>(
    deps: readonly string[],
    loader: (...args: any[]) => VisualizationExtensionMethods<S>
  ): void;
}

interface VisualizationExtensionMethods<S> {
  mounted(this: S, $element: readonly [HTMLElement]): void;
  paint(this: S, $element: readonly [HTMLElement], layout: any): Promise<void>;
  destroy(this: S): void;
}

interface ConnectFourComponentState {
  root: Root;
  readonly backendApi: any;
}

define<ConnectFourComponentState>(["qlik", "css!./styles.css"], (qlik) => ({
  mounted($element) {
    initializeProperties(this.backendApi);
    const app = qlik.currApp(this);
    this.root = createRoot($element[0]);
  },

  async paint($element, layout) {
    console.log("paint", layout);
    this.root.render(<App layout={layout} />);
  },

  destroy() {
    this.root.unmount();
  },
}));

function initializeProperties(backendApi: any) {
  const initialProperties = {
    lc4Version: "0.1.0",
    playerPositions: {
      qListObjectDef: {
        qDef: { qFieldDefs: ["PlayerPosition"] },
        qInitialDataFetch: [{ qWidth: 1, qHeight: 7 * 6 }],
      },
    },
    aiPositions: {
      qListObjectDef: {
        qDef: { qFieldDefs: ["AiPosition"] },
        qInitialDataFetch: [{ qWidth: 1, qHeight: 7 * 6 }],
      },
    },
  };

  backendApi.applyPatches(
    Object.entries(initialProperties).map(([k, v]) => ({
      qOp: "add",
      qPath: `/${k}`,
      qValue: JSON.stringify(v),
    })),
    true
  );
}
