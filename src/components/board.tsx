import { Fragment, memo } from "react";
import { bemClasses } from "../utility/bem-classes.js";
import { parsePositionStr, PositionStr } from "../utility/position.js";

declare module "csstype" {
  interface Properties {
    "--lc4-column"?: number;
    "--lc4-row"?: number;
  }
}

const cls = bemClasses("lc4-board");

interface BoardProps {
  readonly playerPositions: readonly PositionStr[];
  readonly aiPositions: readonly PositionStr[];
}

export const Board = memo<BoardProps>(({ playerPositions, aiPositions }) => {
  return (
    <div className={cls.block()}>
      {new Array(7).fill(0).map((_, i) => (
        <Fragment key={i}>
          <div
            className={cls.element("column-highlight")}
            style={{ "--lc4-column": i + 1 }}
          />
          <div
            className={cls.element("drop-affordance")}
            style={{ "--lc4-column": i + 1 }}
          >
            ↓
          </div>
        </Fragment>
      ))}
      {playerPositions.map((position) => (
        <Token key={`player-${position}`} position={position} owner="player" />
      ))}
      {aiPositions.map((position) => (
        <Token key={`ai-${position}`} position={position} owner="ai" />
      ))}
      <Wall />
    </div>
  );
});

interface TokenProps {
  readonly owner: "player" | "ai";
  readonly position: PositionStr;
}

const Token = memo<TokenProps>(({ owner, position }) => {
  const [column, row] = parsePositionStr(position);
  return (
    <div
      className={cls.element("token")}
      style={{ "--lc4-column": column, "--lc4-row": row }}
    >
      {owner === "player" ? "❌" : "⭕"}
    </div>
  );
});

const Wall = memo(() => (
  <div className={cls.element("wall")}>
    {new Array(7 * 6).fill(0).map((_, i) => (
      <div key={i} className={cls.element("tile")} />
    ))}
  </div>
));
