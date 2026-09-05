export type Matrix = number[][];

function assertMatrix(matrix: Matrix, name: string) {
  if (!matrix.length || !matrix[0].length) throw new Error(`${name} cannot be empty`);
  const columns = matrix[0].length;
  if (matrix.some((row) => row.length !== columns)) throw new Error(`${name} must be rectangular`);
  if (matrix.some((row) => row.some((value) => Number.isNaN(value)))) throw new Error(`${name} contains NaN`);
}

export function transpose(matrix: Matrix): Matrix {
  assertMatrix(matrix, "matrix");
  return matrix[0].map((_, column) => matrix.map((row) => row[column]));
}

export function matmul(left: Matrix, right: Matrix): Matrix {
  assertMatrix(left, "left matrix");
  assertMatrix(right, "right matrix");
  if (left[0].length !== right.length) {
    throw new Error(`matrix shape mismatch: [${left.length},${left[0].length}] × [${right.length},${right[0].length}]`);
  }
  return left.map((row) =>
    right[0].map((_, column) =>
      row.reduce((sum, value, inner) => sum + value * right[inner][column], 0),
    ),
  );
}

export function scaleMatrix(matrix: Matrix, factor: number): Matrix {
  assertMatrix(matrix, "matrix");
  return matrix.map((row) => row.map((value) => value * factor));
}

export function applyCausalMask(matrix: Matrix): Matrix {
  assertMatrix(matrix, "matrix");
  return matrix.map((row, rowIndex) =>
    row.map((value, columnIndex) => columnIndex > rowIndex ? Number.NEGATIVE_INFINITY : value),
  );
}

export function softmaxRows(matrix: Matrix): Matrix {
  assertMatrix(matrix, "matrix");
  return matrix.map((row) => {
    const finite = row.filter(Number.isFinite);
    const peak = finite.length ? Math.max(...finite) : 0;
    const exponentials = row.map((value) => Number.isFinite(value) ? Math.exp(value - peak) : 0);
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    return exponentials.map((value) => total ? value / total : 0);
  });
}

export function formatNumber(value: number, precision = 2): string {
  if (value === Number.NEGATIVE_INFINITY) return "−∞";
  if (value === Number.POSITIVE_INFINITY) return "∞";
  if (Math.abs(value) < 10 ** (-(precision + 1))) return "0";
  return value.toFixed(precision).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatMatrix(matrix: Matrix, precision = 2): string[][] {
  return matrix.map((row) => row.map((value) => formatNumber(value, precision)));
}

export function matrixText(matrix: Matrix, precision = 2): string {
  return `[${formatMatrix(matrix, precision).map((row) => `[${row.join(",")}]`).join(",")}]`;
}
