import { FC } from "react";
import { PositionStr } from "../utility/position.js";
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
}

export const App: FC<AppProps> = ({ layout }) => {
  console.log("App", layout);
  return (
    <div className="lc4">
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
