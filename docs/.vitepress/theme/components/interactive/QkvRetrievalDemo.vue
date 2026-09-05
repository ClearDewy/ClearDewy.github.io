<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useData } from "vitepress";
import {
  applyCausalMask,
  formatMatrix,
  matmul,
  matrixText,
  scaleMatrix,
  softmaxRows,
  transpose,
  type Matrix,
} from "../../visualizations/model/matrix-math";

type MatrixValue = number | string;
type EditableMatrix = "X" | "WQ" | "WK" | "WV";
type EditableGroup = { key: EditableMatrix; label: string; tone: "x" | "q" | "k" | "v"; centerX: number; topY: number; stageIndex: number };
type Stage = { short: string; title: string; formula: string; note: string };
type Point = { x: number; y: number };
type MatrixOptions = {
  alpha?: number;
  row?: number;
  column?: number;
  target?: Point;
  masked?: Point;
  pulse?: number;
};

const { isDark } = useData();
const props = withDefaults(defineProps<{ scope?: "roles" | "full" }>(), {
  scope: "full",
});
const canvas = ref<HTMLCanvasElement>();
const canvasHost = ref<HTMLDivElement>();
const current = ref(0);
const playing = ref(false);

const defaultInputs: Record<EditableMatrix, Matrix> = {
  X: [[1, 0], [0, 1]],
  WQ: [[1, 0], [0, 1]],
  WK: [[1, 0], [0, 1]],
  WV: [[2, 0], [0, 4]],
};
const inputs = ref<Record<EditableMatrix, Matrix>>(structuredClone(defaultInputs));
const editableGroups: EditableGroup[] = [
  { key: "X", label: "X", tone: "x", centerX: 120, topY: 68, stageIndex: 1 },
  { key: "WQ", label: "WQ", tone: "q", centerX: 350, topY: 68, stageIndex: 1 },
  { key: "X", label: "X", tone: "x", centerX: 120, topY: 183, stageIndex: 2 },
  { key: "WK", label: "WK", tone: "k", centerX: 350, topY: 183, stageIndex: 2 },
  { key: "X", label: "X", tone: "x", centerX: 120, topY: 298, stageIndex: 3 },
  { key: "WV", label: "WV", tone: "v", centerX: 350, topY: 298, stageIndex: 3 },
];
const blankMatrix = [["", ""], ["", ""]];
const facts = computed(() => {
  const Q = matmul(inputs.value.X, inputs.value.WQ);
  const K = matmul(inputs.value.X, inputs.value.WK);
  const V = matmul(inputs.value.X, inputs.value.WV);
  const score = matmul(Q, transpose(K));
  const scaled = scaleMatrix(score, 1 / Math.sqrt(K[0].length));
  const masked = applyCausalMask(scaled);
  const weights = softmaxRows(masked);
  const output = matmul(weights, V);
  return { Q, K, V, score, scaled, masked, weights, output };
});
const display = computed(() => ({
  Q: formatMatrix(facts.value.Q),
  K: formatMatrix(facts.value.K),
  KT: formatMatrix(transpose(facts.value.K)),
  V: formatMatrix(facts.value.V),
  score: formatMatrix(facts.value.score),
  scaled: formatMatrix(facts.value.scaled, 3),
  masked: formatMatrix(facts.value.masked, 3),
  weights: formatMatrix(facts.value.weights, 2),
  output: formatMatrix(facts.value.output, 2),
}));

const stages: Stage[] = [
  { short: "输入", title: "固定两个 token 的输入表示", formula: "X ∈ ℝ²ˣ²", note: "每一行是一个 token，每一列是一个特征。" },
  { short: "Q 投影", title: "生成 Query：当前 token 要找什么", formula: "Q = XWQ", note: "绿色输入经过紫色参数投影，得到每个位置的 Query。" },
  { short: "K 投影", title: "生成 Key：候选 token 如何被匹配", formula: "K = XWK", note: "Key 参与匹配，但不直接提供最终读取的内容。" },
  { short: "V 投影", title: "生成 Value：匹配后取回什么", formula: "V = XWV", note: "Value 不参与 QKᵀ 打分，只在最后被权重加权汇总。" },
  { short: "点积", title: "每个 Query 与所有 Key 配对", formula: "S = QKᵀ", note: "动画依次锁定 Q 的一行、Kᵀ 的一列，以及它们生成的输出格。" },
  { short: "缩放", title: "按 Key 维度缩放点积分数", formula: "S / √2", note: "缩放压住高维点积的幅度，避免 Softmax 过早饱和。" },
  { short: "遮罩", title: "因果遮罩禁止读取未来 token", formula: "S / √2 + M", note: "右上角表示 token 1 读取 token 2，被替换为负无穷。" },
  { short: "Softmax", title: "每一行分数变成读取比例", formula: "P = softmax(S / √2 + M)", note: "每行非负且和为 1；被遮罩的位置权重严格为 0。" },
  { short: "读取 V", title: "用注意力权重汇总 Value", formula: "Z = PV", note: "动画再次锁定一行与一列；这一步才真正把其他位置的内容写入输出。" },
];

const activeStages = computed(() => props.scope === "roles" ? stages.slice(0, 4) : stages);
const stage = computed(() => activeStages.value[current.value]);
const ariaLabel = computed(() => `QKV 矩阵动画。当前：${stage.value.title}。${stage.value.formula}。${stage.value.note}`);
const staticWeights = computed(() => matrixText(facts.value.weights, 2));
const staticOutput = computed(() => matrixText(facts.value.output, 2));
const logicalWidth = 1040;
const logicalHeight = props.scope === "roles" ? 404 : 660;
let timer: ReturnType<typeof setInterval> | undefined;
let animationFrame = 0;
let reducedMotion = false;

function colors() {
  return isDark.value
    ? {
        background: "#17181c", line: "#454952", text: "#e5e7eb", muted: "#9ca3af",
        x: "#67c956", q: "#b37bea", k: "#f3a04a", v: "#63aaf5", score: "#aeb5c0",
        mask: "#ef6b73", weight: "#38c5ad", z: "#ec91bd",
      }
    : {
        background: "#ffffff", line: "#c9ccd1", text: "#34363d", muted: "#737780",
        x: "#59b946", q: "#a768df", k: "#ef922f", v: "#559fe9", score: "#69717d",
        mask: "#e45863", weight: "#16a58e", z: "#e784b2",
      };
}

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 18, color = colors().text, weight = 500, align: CanvasTextAlign = "center") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawMatrixLabel(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, color: string) {
  if (/^W[QKV]$/.test(label)) {
    drawText(ctx, "W", x - 5, y, 23, color, 760);
    drawText(ctx, label[1], x + 10, y - 8, 13, color, 760);
    return;
  }
  drawText(ctx, label, x, y, 23, color, 760);
}

function drawMatrix(ctx: CanvasRenderingContext2D, matrix: MatrixValue[][], centerX: number, topY: number, label: string, color: string, options: MatrixOptions = {}) {
  const cellWidth = 43;
  const cellHeight = 34;
  const gap = 3;
  const width = matrix[0].length * cellWidth + (matrix[0].length - 1) * gap;
  const left = centerX - width / 2;
  const alpha = options.alpha ?? 1;
  const palette = colors();

  ctx.save();
  ctx.globalAlpha = alpha;
  drawMatrixLabel(ctx, label, centerX, topY - 20, color);
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const x = left + columnIndex * (cellWidth + gap);
      const y = topY + rowIndex * (cellHeight + gap);
      const isRow = options.row === rowIndex;
      const isColumn = options.column === columnIndex;
      const isTarget = options.target?.x === columnIndex && options.target?.y === rowIndex;
      const isMasked = options.masked?.x === columnIndex && options.masked?.y === rowIndex;
      const emphasis = isTarget ? 0.34 + (options.pulse ?? 0) * 0.12 : isRow && isColumn ? 0.28 : isRow || isColumn ? 0.19 : 0.1;

      ctx.beginPath();
      ctx.roundRect(x, y, cellWidth, cellHeight, 4);
      ctx.fillStyle = withAlpha(isMasked ? palette.mask : color, emphasis);
      ctx.fill();
      ctx.lineWidth = isTarget || isMasked ? 2.2 : 1;
      ctx.strokeStyle = withAlpha(isMasked ? palette.mask : color, isTarget || isMasked ? 1 : 0.72);
      ctx.stroke();
      const valueText = String(value);
      const valueSize = valueText.length > 7 ? 8 : valueText.length > 5 ? 10 : valueText.length > 3 ? 11 : 13;
      drawText(ctx, valueText, x + cellWidth / 2, y + cellHeight / 2 + 1, valueSize, isMasked ? palette.mask : palette.text, isTarget || isMasked ? 760 : 560);

      if (isMasked) {
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 7);
        ctx.lineTo(x + cellWidth - 8, y + cellHeight - 7);
        ctx.strokeStyle = withAlpha(palette.mask, 0.62);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  });
  ctx.restore();
}

function drawOperator(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  drawText(ctx, text, x, y, 22, colors().muted, 500);
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, toX: number, y: number, color: string, active: boolean, time: number) {
  const palette = colors();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(fromX, y);
  ctx.lineTo(toX, y);
  ctx.strokeStyle = active ? withAlpha(color, 0.75) : withAlpha(palette.line, 0.55);
  ctx.lineWidth = active ? 2 : 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(toX, y);
  ctx.lineTo(toX - 8, y - 5);
  ctx.lineTo(toX - 8, y + 5);
  ctx.closePath();
  ctx.fillStyle = active ? color : palette.line;
  ctx.fill();
  if (active && !reducedMotion) {
    const progress = (time / 1150) % 1;
    const x = fromX + (toX - fromX) * progress;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fill();
  }
  ctx.restore();
}

function projectionAlpha(index: number) {
  if (current.value === index) return 1;
  if (current.value === 0) return 0.24;
  if (current.value > index) return current.value >= 4 ? 0.46 : 0.62;
  return 0.2;
}

function editableCellStyle(group: EditableGroup, row: number, column: number) {
  const cellWidth = 43;
  const cellHeight = 34;
  const gap = 3;
  const matrixWidth = cellWidth * 2 + gap;
  const alpha = group.key === "X"
    ? current.value === 0 || current.value === group.stageIndex ? 1 : 0.62
    : projectionAlpha(group.stageIndex);
  return {
    left: `${((group.centerX - matrixWidth / 2 + column * (cellWidth + gap)) / logicalWidth) * 100}%`,
    top: `${((group.topY + row * (cellHeight + gap)) / logicalHeight) * 100}%`,
    width: `${(cellWidth / logicalWidth) * 100}%`,
    height: `${(cellHeight / logicalHeight) * 100}%`,
    opacity: alpha,
  };
}

function drawProjectionRow(ctx: CanvasRenderingContext2D, y: number, result: MatrixValue[][], weightLabel: string, resultLabel: string, color: string, stageIndex: number, time: number) {
  const alpha = projectionAlpha(stageIndex);
  drawMatrix(ctx, blankMatrix, 120, y, "X", colors().x, { alpha: current.value === 0 || current.value === stageIndex ? 1 : 0.62 });
  drawOperator(ctx, "×", 235, y + 35, alpha);
  drawMatrix(ctx, blankMatrix, 350, y, weightLabel, color, { alpha });
  drawOperator(ctx, "=", 465, y + 35, alpha);
  drawMatrix(ctx, result, 580, y, resultLabel, color, { alpha, pulse: (Math.sin(time / 260) + 1) / 2 });
  drawArrow(ctx, 650, 815, y + 35, color, current.value === stageIndex, time);
  const descriptions = ["提出当前需要", "提供匹配索引", "携带可读取内容"];
  drawText(ctx, descriptions[stageIndex - 1], 840, y + 21, 15, current.value === stageIndex ? colors().text : colors().muted, current.value === stageIndex ? 700 : 500, "left");
  drawText(ctx, stageIndex < 3 ? "参与 QKᵀ" : "参与 P · V", 840, y + 47, 12, color, 650, "left");
}

function draw(time: number) {
  const node = canvas.value;
  const host = canvasHost.value;
  if (!node || !host) return;
  const cssWidth = Math.max(320, host.clientWidth);
  const cssHeight = cssWidth * logicalHeight / logicalWidth;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const nextWidth = Math.round(cssWidth * ratio);
  const nextHeight = Math.round(cssHeight * ratio);
  if (node.width !== nextWidth || node.height !== nextHeight) {
    node.width = nextWidth;
    node.height = nextHeight;
    node.style.height = `${cssHeight}px`;
  }
  const ctx = node.getContext("2d");
  if (!ctx) return;
  const scale = cssWidth / logicalWidth;
  ctx.setTransform(ratio * scale, 0, 0, ratio * scale, 0, 0);
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

  const palette = colors();
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);
  drawText(ctx, "同一个输入 X，经过三组可学习参数，产生三种角色", 42, 28, 15, palette.muted, 560, "left");

  drawProjectionRow(ctx, 68, display.value.Q, "WQ", "Q", palette.q, 1, time);
  drawProjectionRow(ctx, 183, display.value.K, "WK", "K", palette.k, 2, time);
  drawProjectionRow(ctx, 298, display.value.V, "WV", "V", palette.v, 3, time);

  if (props.scope === "roles") {
    drawText(ctx, "Q、K 决定怎样匹配；V 决定匹配后传递什么", 500, 390, 13, palette.muted, 600);
    animationFrame = requestAnimationFrame(draw);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(42, 414);
  ctx.lineTo(998, 414);
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.stroke();
  drawText(ctx, "缩放点积注意力", 42, 442, 15, palette.muted, 700, "left");

  const attentionAlpha = current.value >= 4 ? 1 : 0.18;
  const focusIndex = Math.floor(time / 820) % 4;
  const focusRow = Math.floor(focusIndex / 2);
  const focusColumn = focusIndex % 2;
  const multiplyFocus = current.value === 4 || current.value === 8;
  const pulse = reducedMotion ? 0.5 : (Math.sin(time / 240) + 1) / 2;

  const qOptions: MatrixOptions = { alpha: attentionAlpha };
  const kOptions: MatrixOptions = { alpha: attentionAlpha };
  if (current.value === 4) {
    qOptions.row = focusRow;
    kOptions.column = focusColumn;
  }
  drawMatrix(ctx, display.value.Q, 100, 493, "Q", palette.q, qOptions);
  drawOperator(ctx, "×", 190, 528, attentionAlpha);
  drawMatrix(ctx, display.value.KT, 280, 493, "Kᵀ", palette.k, kOptions);
  drawOperator(ctx, current.value === 4 ? "=" : "→", 370, 528, attentionAlpha);

  let workingMatrix: MatrixValue[][] = display.value.score;
  let workingLabel = "S";
  let workingColor = palette.score;
  const workingOptions: MatrixOptions = { alpha: attentionAlpha, pulse };
  if (current.value === 4) workingOptions.target = { x: focusColumn, y: focusRow };
  if (current.value === 5) { workingMatrix = display.value.scaled; workingLabel = "S / √2"; }
  if (current.value === 6) { workingMatrix = display.value.masked; workingLabel = "S / √2 + M"; workingColor = palette.mask; workingOptions.masked = { x: 1, y: 0 }; }
  if (current.value >= 7) { workingMatrix = display.value.weights; workingLabel = "P"; workingColor = palette.weight; }
  if (current.value === 8) workingOptions.row = focusRow;
  drawMatrix(ctx, workingMatrix, 500, 493, workingLabel, workingColor, workingOptions);

  const vOptions: MatrixOptions = { alpha: current.value === 8 ? 1 : current.value >= 4 ? 0.46 : 0.26 };
  if (current.value === 8) vOptions.column = focusColumn;
  drawOperator(ctx, "×", 600, 528, current.value === 8 ? 1 : 0.2);
  drawMatrix(ctx, display.value.V, 700, 493, "V", palette.v, vOptions);
  drawOperator(ctx, "=", 790, 528, current.value === 8 ? 1 : 0.2);
  drawMatrix(ctx, display.value.output, 890, 493, "Z", palette.z, {
    alpha: current.value === 8 ? 1 : 0.26,
    target: current.value === 8 ? { x: focusColumn, y: focusRow } : undefined,
    pulse,
  });

  if (current.value === 4) drawArrow(ctx, 145, 455, 590, palette.score, true, time);
  else if (current.value === 8) drawArrow(ctx, 750, 835, 590, palette.z, true, time);
  drawText(ctx, multiplyFocus ? `当前：第 ${focusRow + 1} 行 × 第 ${focusColumn + 1} 列` : stage.value.formula, 500, 625, 14, palette.muted, 600);
  animationFrame = requestAnimationFrame(draw);
}

function stop() {
  playing.value = false;
  if (timer) clearInterval(timer);
  timer = undefined;
}

function go(index: number) {
  current.value = Math.max(0, Math.min(activeStages.value.length - 1, index));
}

function play() {
  if (playing.value) return stop();
  if (current.value === activeStages.value.length - 1) current.value = 0;
  playing.value = true;
  timer = setInterval(() => {
    if (current.value === activeStages.value.length - 1) return stop();
    current.value += 1;
  }, 2100);
}

function updateCell(key: EditableMatrix, row: number, column: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.value.trim()) return;
  const parsed = Number(input.value);
  if (!Number.isFinite(parsed)) return;
  const value = Math.max(-99, Math.min(99, parsed));
  const matrix = inputs.value[key].map((items) => [...items]);
  matrix[row][column] = value;
  inputs.value = { ...inputs.value, [key]: matrix };
  input.value = String(value);
  stop();
}

function restoreCell(key: EditableMatrix, row: number, column: number, event: Event) {
  (event.target as HTMLInputElement).value = String(inputs.value[key][row][column]);
}

function restoreExample() {
  inputs.value = structuredClone(defaultInputs);
  stop();
  current.value = 0;
}

function reset() {
  stop();
  current.value = 0;
}

onMounted(() => {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  animationFrame = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  stop();
  cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <figure class="interactive-card qkv-canvas-demo">
    <figcaption>
      <span>{{ props.scope === "roles" ? "QKV：同一个输入怎样产生三种检索角色" : "QKV：从三组投影到一次完整注意力读取" }}</span>
      <span class="qkv-canvas-demo__caption-tools">
        <span class="qkv-canvas-demo__legend" aria-hidden="true">
          <i class="x"></i>X <i class="q"></i>Q <i class="k"></i>K <i class="v"></i>V
        </span>
        <span class="qkv-canvas-demo__edit-hint">X/W 数值可直接编辑</span>
        <button type="button" @click="restoreExample">恢复数值</button>
      </span>
    </figcaption>

    <div ref="canvasHost" class="qkv-canvas-demo__canvas-host">
      <canvas ref="canvas" :aria-label="ariaLabel" role="img"></canvas>
      <template v-for="(group, groupIndex) in editableGroups" :key="`${group.key}-${groupIndex}`">
        <template v-for="(row, rowIndex) in inputs[group.key]" :key="rowIndex">
          <input
            v-for="(value, columnIndex) in row"
            :key="columnIndex"
            :class="['qkv-canvas-demo__canvas-input', group.tone]"
            :style="editableCellStyle(group, rowIndex, columnIndex)"
            type="number"
            min="-99"
            max="99"
            step="0.1"
            :value="value"
            :aria-label="`${group.label}（${stages[group.stageIndex].short}）第 ${rowIndex + 1} 行第 ${columnIndex + 1} 列`"
            @input="updateCell(group.key, rowIndex, columnIndex, $event)"
            @blur="restoreCell(group.key, rowIndex, columnIndex, $event)"
          >
        </template>
      </template>
    </div>

    <ol class="qkv-canvas-demo__timeline" aria-label="动画阶段" :style="{ '--stage-count': activeStages.length }">
      <li v-for="(item, index) in activeStages" :key="item.short">
        <button type="button" :class="{ active: index === current, complete: index < current }" :aria-current="index === current ? 'step' : undefined" @click="go(index)">
          {{ item.short }}
        </button>
      </li>
    </ol>

    <section class="qkv-canvas-demo__explanation" aria-live="polite">
      <div>
        <strong>{{ stage.title }}</strong>
        <code>{{ stage.formula }}</code>
      </div>
      <p>{{ stage.note }}</p>
    </section>

    <div class="interactive-controls qkv-canvas-demo__controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" class="qkv-canvas-demo__play" @click="play"><span aria-hidden="true">{{ playing ? "Ⅱ" : "▶" }}</span>{{ playing ? "暂停" : "播放" }}</button>
      <button type="button" class="secondary" :disabled="current === activeStages.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="reset">回到开头</button>
      <span>{{ current + 1 }} / {{ activeStages.length }}</span>
    </div>

    <p v-if="props.scope === 'roles'" class="qkv-canvas-demo__fallback interactive-fallback">同一个输入 X 分别与 WQ、WK、WV 相乘，生成 Query、Key 和 Value。Q、K 用于匹配，V 提供匹配后传递的内容。</p>
    <p v-else class="qkv-canvas-demo__fallback interactive-fallback">计算路径：X 生成 Q、K、V；QKᵀ 经缩放、因果遮罩和 Softmax 得到 P；P 与 V 相乘得到 Z。当前 P={{ staticWeights }}，Z={{ staticOutput }}。</p>
  </figure>
</template>

<style scoped>
.qkv-canvas-demo > figcaption { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.qkv-canvas-demo__caption-tools { display: flex; align-items: center; gap: 10px; }
.qkv-canvas-demo__legend { display: flex; align-items: center; gap: 5px; color: var(--vp-c-text-2); font-size: 11px; font-weight: 600; }
.qkv-canvas-demo__legend i { width: 8px; height: 8px; margin-left: 5px; border-radius: 50%; }
.qkv-canvas-demo__legend .x { background: #59b946; }
.qkv-canvas-demo__legend .q { background: #a768df; }
.qkv-canvas-demo__legend .k { background: #ef922f; }
.qkv-canvas-demo__legend .v { background: #559fe9; }
.qkv-canvas-demo__edit-hint { color: var(--vp-c-text-2); font-size: 11px; font-weight: 500; }
.qkv-canvas-demo__caption-tools > button { padding: 4px 8px; border: 1px solid var(--vp-c-divider); border-radius: 6px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; font-size: 11px; }
.qkv-canvas-demo__caption-tools > button:hover { border-color: var(--vp-c-text-3); color: var(--vp-c-text-1); }
.qkv-canvas-demo__canvas-host { position: relative; width: 100%; background: var(--vp-c-bg); }
.qkv-canvas-demo__canvas-host canvas { display: block; width: 100%; }
.qkv-canvas-demo__canvas-input { position: absolute; z-index: 2; box-sizing: border-box; min-width: 0; margin: 0; padding: 0 2px; border: 1px solid var(--cell-color); border-radius: 4px; color: var(--vp-c-text-1); background: color-mix(in srgb, var(--cell-color), var(--vp-c-bg) 91%); font: 560 clamp(8px, 1vw, 13px) var(--vp-font-family-mono); text-align: center; transition: opacity .15s, box-shadow .15s, border-color .15s; appearance: textfield; }
.qkv-canvas-demo__canvas-input::-webkit-inner-spin-button,
.qkv-canvas-demo__canvas-input::-webkit-outer-spin-button { margin: 0; appearance: none; }
.qkv-canvas-demo__canvas-input.x { --cell-color: #59b946; }
.qkv-canvas-demo__canvas-input.q { --cell-color: #a768df; }
.qkv-canvas-demo__canvas-input.k { --cell-color: #ef922f; }
.qkv-canvas-demo__canvas-input.v { --cell-color: #559fe9; }
.qkv-canvas-demo__canvas-input:hover { border-width: 1.5px; opacity: 1 !important; }
.qkv-canvas-demo__canvas-input:focus { z-index: 3; opacity: 1 !important; }
.qkv-canvas-demo__canvas-input:focus-visible { border-width: 2px; outline: 2px solid color-mix(in srgb, var(--cell-color), transparent 68%); outline-offset: 1px; box-shadow: 0 2px 12px color-mix(in srgb, var(--cell-color), transparent 74%); }
.qkv-canvas-demo__timeline { display: grid; grid-template-columns: repeat(var(--stage-count, 9), minmax(0, 1fr)); gap: 5px; margin: 0; padding: 12px 14px; border-top: 1px solid var(--vp-c-divider); list-style: none; background: var(--vp-c-bg-soft); }
.qkv-canvas-demo__timeline li { position: relative; margin: 0; }
.qkv-canvas-demo__timeline li:not(:last-child)::after { position: absolute; z-index: 0; top: 50%; right: -5px; width: 5px; height: 1px; background: var(--vp-c-divider); content: ""; }
.qkv-canvas-demo__timeline button { position: relative; z-index: 1; width: 100%; min-width: 0; padding: 7px 3px; border: 1px solid var(--vp-c-divider); border-radius: 7px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; font-size: 11px; font-weight: 650; white-space: nowrap; }
.qkv-canvas-demo__timeline button.complete { border-color: color-mix(in srgb, var(--vp-c-brand-1), transparent 62%); color: var(--vp-c-text-1); }
.qkv-canvas-demo__timeline button.active { border-color: #3f4148; color: #fff; background: #3f4148; box-shadow: 0 0 0 2px color-mix(in srgb, #3f4148, transparent 83%); }
.qkv-canvas-demo__explanation { display: grid; grid-template-columns: minmax(250px, .9fr) minmax(0, 1.1fr); align-items: center; gap: 22px; min-height: 92px; padding: 15px 18px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.qkv-canvas-demo__explanation div { display: grid; gap: 6px; }
.qkv-canvas-demo__explanation strong { color: var(--vp-c-text-1); font-size: 15px; }
.qkv-canvas-demo__explanation code { width: fit-content; color: var(--vp-c-brand-1); font-size: 13px; }
.qkv-canvas-demo__explanation p { margin: 0; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.65; }
.qkv-canvas-demo__controls { justify-content: center; }
.qkv-canvas-demo__controls .qkv-canvas-demo__play { display: inline-flex; align-items: center; gap: 6px; min-width: 76px; color: #fff; background: #3f4148; }
.qkv-canvas-demo__controls button:disabled { cursor: not-allowed; opacity: .42; }
.qkv-canvas-demo__fallback { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; white-space: nowrap; }
.dark .qkv-canvas-demo__timeline button.active,
.dark .qkv-canvas-demo__controls .qkv-canvas-demo__play { background: #4a4d55; }
@media (max-width: 760px) {
  .qkv-canvas-demo__timeline { grid-template-columns: repeat(3, 1fr); }
  .qkv-canvas-demo__timeline li::after { display: none; }
  .qkv-canvas-demo__explanation { grid-template-columns: 1fr; gap: 10px; }
}
@media (max-width: 520px) {
  .qkv-canvas-demo > figcaption { align-items: flex-start; flex-direction: column; }
  .qkv-canvas-demo__caption-tools { flex-wrap: wrap; }
  .qkv-canvas-demo__edit-hint { order: 3; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .qkv-canvas-demo__timeline button { transition: none; }
}
</style>
