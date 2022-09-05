import { FC, useMemo } from "react";
import { PositionStr } from "../utility/position.js";
import { usePromise } from "../utility/use-promise.js";
import { Board } from "./board.js";

interface GenericObjectLayout {
  readonly lc4Version: string;
  readonly playerPositions: ListObjectLayout;
  readonly aiPositions: ListObjectLayout;
}

interface ListObjectLayout {
  readonly qListObject: {
    readonly qDataPages: readonly {
      readonly qMatrix: readonly {
        readonly qElemNumber: number;
        readonly qState: "X" | "S";
        readonly qText: PositionStr;
      }[][];
    }[];
  };
}

interface AppProps {
  readonly layout: GenericObjectLayout;
  readonly themePromise: Promise<any>;
}

export const App: FC<AppProps> = ({ layout, themePromise }) => {
  const { value: theme } = usePromise(themePromise);
  const themeColors = useMemo(
    () =>
      theme &&
      Object.fromEntries([
        ...theme.properties.palettes.ui[0].colors.map(
          (c: string, i: number) => [`--lc4-theme-color-ui-${i + 1}`, c]
        ),
        ...Object.entries(theme.properties.dataColors).map(([name, color]) => [
          `--lc4-theme-color-data-${name.replace("Color", "")}`,
          color,
        ]),
      ]),
    [theme]
  );

  console.log("App", layout, theme);

  return (
    <div className="lc4" style={themeColors}>
      {!layout.lc4Version ? (
        "Loading ..."
      ) : (
        <Board
          playerPositions={layout.playerPositions.qListObject.qDataPages[0].qMatrix
            .filter(([{ qState }]) => qState === "S")
            .map(([{ qText }]) => qText)}
          aiPositions={layout.aiPositions.qListObject.qDataPages[0].qMatrix
            .filter(([{ qState }]) => qState === "S")
            .map(([{ qText }]) => qText)}
        />
      )}
    </div>
  );
};
