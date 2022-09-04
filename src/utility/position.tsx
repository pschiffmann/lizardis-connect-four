type NumberLiteral = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type PositionStr = `(${NumberLiteral},${NumberLiteral})`;

const positionStrPattern = /^\((\d),(\d)\)$/;

export function parsePositionStr(
  positionStr: PositionStr
): [x: number, y: number] {
  const [, x, y] = positionStr.match(positionStrPattern)!;
  return [Number.parseInt(x), Number.parseInt(y)];
}
