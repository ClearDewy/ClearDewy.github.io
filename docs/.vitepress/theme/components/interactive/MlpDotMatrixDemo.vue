<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";

type Label = 0 | 1;
type Sample = { pixels: number[]; label: Label };

const size = 5;
const inputSize = size * size;
const hiddenSize = 6;
const outputSize = 2;
const basePatterns: Record<"O" | "X", number[]> = {
  O: [
    0, 1, 1, 1, 0,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    0, 1, 1, 1, 0,
  ],
  X: [
    1, 0, 0, 0, 1,
    0, 1, 0, 1, 0,
    0, 0, 1, 0, 0,
    0, 1, 0, 1, 0,
    1, 0, 0, 0, 1,
  ],
};

const canvas = ref<HTMLCanvasElement>();
const host = ref<HTMLElement>();
const width = ref(760);
const selectedCell = ref(0);
const pixels = ref([...basePatterns.O]);
const epoch = ref(0);
const { isDark } = useData();
let observer: ResizeObserver | undefined;
let W1: number[][] = [];
let b1: number[] = [];
let W2: number[][] = [];
let b2: number[] = [];

function zeros(rows: number, columns: number) {
  return Array.from({ length: rows }, () => Array(columns).fill(0) as number[]);
}

function initialize() {
  let seed = 17;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  W1 = Array.from({ length: inputSize }, () =>
    Array.from({ length: hiddenSize }, () => (random() * 2 - 1) * 0.22),
  );
  b1 = Array(hiddenSize).fill(0);
  W2 = Array.from({ length: hiddenSize }, () =>
    Array.from({ length: outputSize }, () => (random() * 2 - 1) * 0.35),
  );
  b2 = Array(outputSize).fill(0);
}

function forward(raw: number[]) {
  const x = raw.map((value) => (value ? 1 : -1));
  const hidden = Array.from({ length: hiddenSize }, (_, j) => {
    const sum = b1[j] + x.reduce((value, item, i) => value + item * W1[i][j], 0);
    return Math.tanh(sum);
  });
  const logits = Array.from({ length: outputSize }, (_, k) =>
    b2[k] + hidden.reduce((value, item, j) => value + item * W2[j][k], 0),
  );
  const maximum = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return { x, hidden, probabilities: exponentials.map((value) => value / total) };
}

const dataset: Sample[] = (["O", "X"] as const).flatMap((name, label) => {
  const base = basePatterns[name];
  const variants = [{ pixels: [...base], label: label as Label }];
  for (let index = 0; index < inputSize; index += 1) {
    const noisy = [...base];
    noisy[index] = noisy[index] ? 0 : 1;
    variants.push({ pixels: noisy, label: label as Label });
  }
  return variants;
});

const current = computed(() => {
  void epoch.value;
  return forward(pixels.value);
});

const predictedLabel = computed(() => current.value.probabilities[0] >= current.value.probabilities[1] ? "O" : "X");
const confidence = computed(() => Math.max(...current.value.probabilities));
const averageLoss = computed(() => {
  void epoch.value;
  return dataset.reduce((sum, sample) => {
    const probability = forward(sample.pixels).probabilities[sample.label];
    return sum - Math.log(Math.max(probability, 1e-9));
  }, 0) / dataset.length;
});

function train(rounds: number) {
  const learningRate = 0.08;
  for (let round = 0; round < rounds; round += 1) {
    const dW1 = zeros(inputSize, hiddenSize);
    const db1 = Array(hiddenSize).fill(0) as number[];
    const dW2 = zeros(hiddenSize, outputSize);
    const db2 = Array(outputSize).fill(0) as number[];

    for (const sample of dataset) {
      const { x, hidden, probabilities } = forward(sample.pixels);
      const dLogits = probabilities.map((value, k) => value - (k === sample.label ? 1 : 0));
      for (let j = 0; j < hiddenSize; j += 1) {
        for (let k = 0; k < outputSize; k += 1) dW2[j][k] += hidden[j] * dLogits[k];
      }
      for (let k = 0; k < outputSize; k += 1) db2[k] += dLogits[k];
      for (let j = 0; j < hiddenSize; j += 1) {
        const dHidden = dLogits.reduce((sum, value, k) => sum + value * W2[j][k], 0);
        const dPreActivation = dHidden * (1 - hidden[j] ** 2);
        db1[j] += dPreActivation;
        for (let i = 0; i < inputSize; i += 1) dW1[i][j] += x[i] * dPreActivation;
      }
    }

    const scale = learningRate / dataset.length;
    for (let i = 0; i < inputSize; i += 1) {
      for (let j = 0; j < hiddenSize; j += 1) W1[i][j] -= scale * dW1[i][j];
    }
    for (let j = 0; j < hiddenSize; j += 1) {
      b1[j] -= scale * db1[j];
      for (let k = 0; k < outputSize; k += 1) W2[j][k] -= scale * dW2[j][k];
    }
    for (let k = 0; k < outputSize; k += 1) b2[k] -= scale * db2[k];
  }
  epoch.value += rounds;
}

function reset() {
  initialize();
  pixels.value = [...basePatterns.O];
  epoch.value = 0;
  selectedCell.value = 0;
}

function choose(name: "O" | "X") {
  pixels.value = [...basePatterns[name]];
}

function toggle(index: number) {
  const next = [...pixels.value];
  next[index] = next[index] ? 0 : 1;
  pixels.value = next;
  selectedCell.value = index;
}

function layout() {
  const mobile = width.value < 620;
  const gridSize = mobile ? Math.min(220, width.value - 48) : Math.min(210, width.value * 0.31);
  return {
    mobile,
    height: mobile ? 610 : 370,
    gridSize,
    gridX: mobile ? (width.value - gridSize) / 2 : 28,
    gridY: mobile ? 58 : 82,
  };
}

function palette() {
  return isDark.value
    ? { text: "#e5e7eb", muted: "#9ca3af", line: "#475569", surface: "#1f2937", pixel: "#d1d5db", off: "#111827", brand: "#60a5fa", warm: "#f59e0b" }
    : { text: "#374151", muted: "#6b7280", line: "#d1d5db", surface: "#f8fafc", pixel: "#374151", off: "#ffffff", brand: "#409eff", warm: "#d97706" };
}

function drawArrow(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();
  const angle = Math.atan2(toY - fromY, toX - fromX);
  context.beginPath();
  context.moveTo(toX, toY);
  context.lineTo(toX - 8 * Math.cos(angle - Math.PI / 6), toY - 8 * Math.sin(angle - Math.PI / 6));
  context.lineTo(toX - 8 * Math.cos(angle + Math.PI / 6), toY - 8 * Math.sin(angle + Math.PI / 6));
  context.closePath();
  context.fill();
}

function draw() {
  const element = canvas.value;
  if (!element) return;
  const context = element.getContext("2d");
  if (!context) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const currentLayout = layout();
  element.width = Math.floor(width.value * dpr);
  element.height = Math.floor(currentLayout.height * dpr);
  element.style.height = `${currentLayout.height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width.value, currentLayout.height);
  const colors = palette();
  const { gridSize, gridX, gridY, mobile } = currentLayout;
  const cell = gridSize / size;

  context.font = "600 13px system-ui, sans-serif";
  context.textAlign = "center";
  context.fillStyle = colors.text;
  context.fillText("输入：5×5 像素", gridX + gridSize / 2, 31);
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const index = row * size + column;
      const x = gridX + column * cell;
      const y = gridY + row * cell;
      context.fillStyle = pixels.value[index] ? colors.pixel : colors.off;
      context.strokeStyle = index === selectedCell.value ? colors.brand : colors.line;
      context.lineWidth = index === selectedCell.value ? 2.5 : 1;
      context.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      context.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
    }
  }

  if (!mobile) {
    const hiddenX = width.value * 0.58;
    const outputX = width.value - 104;
    context.fillStyle = colors.text;
    context.fillText("隐藏表示 h（6 维）", hiddenX, 31);
    context.fillText("输出概率", outputX, 31);
    drawArrow(context, gridX + gridSize + 20, gridY + gridSize / 2, hiddenX - 38, gridY + gridSize / 2, colors.line);
    context.fillStyle = colors.muted;
    context.font = "12px system-ui, sans-serif";
    context.fillText("展平 + 加权 + tanh", (gridX + gridSize + hiddenX - 38) / 2, gridY + gridSize / 2 - 12);
    current.value.hidden.forEach((activation, index) => {
      const y = 72 + index * 46;
      const strength = Math.min(1, Math.abs(activation));
      context.beginPath();
      context.fillStyle = activation >= 0 ? `rgba(64,158,255,${0.14 + strength * 0.64})` : `rgba(245,158,11,${0.14 + strength * 0.64})`;
      context.strokeStyle = activation >= 0 ? colors.brand : colors.warm;
      context.lineWidth = 1.5;
      context.arc(hiddenX, y, 18, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = colors.text;
      context.font = "11px ui-monospace, monospace";
      context.fillText(activation.toFixed(2), hiddenX, y + 4);
    });
    drawArrow(context, hiddenX + 35, gridY + gridSize / 2, outputX - 58, gridY + gridSize / 2, colors.line);
    ["O", "X"].forEach((label, index) => {
      const y = 118 + index * 94;
      const probability = current.value.probabilities[index];
      context.fillStyle = colors.surface;
      context.fillRect(outputX - 42, y, 84, 24);
      context.fillStyle = index === (predictedLabel.value === "O" ? 0 : 1) ? colors.brand : colors.line;
      context.fillRect(outputX - 42, y, 84 * probability, 24);
      context.fillStyle = colors.text;
      context.font = "600 13px system-ui, sans-serif";
      context.fillText(`${label}  ${(probability * 100).toFixed(1)}%`, outputX, y - 8);
    });
  } else {
    const hiddenY = gridY + gridSize + 88;
    const startX = (width.value - (hiddenSize - 1) * 42) / 2;
    context.fillStyle = colors.text;
    context.font = "600 13px system-ui, sans-serif";
    context.fillText("隐藏表示 h（6 维）", width.value / 2, hiddenY - 42);
    drawArrow(context, width.value / 2, gridY + gridSize + 14, width.value / 2, hiddenY - 26, colors.line);
    current.value.hidden.forEach((activation, index) => {
      const x = startX + index * 42;
      context.beginPath();
      context.fillStyle = activation >= 0 ? "rgba(64,158,255,.52)" : "rgba(245,158,11,.52)";
      context.strokeStyle = activation >= 0 ? colors.brand : colors.warm;
      context.arc(x, hiddenY, 16, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });
    const outputY = hiddenY + 105;
    drawArrow(context, width.value / 2, hiddenY + 28, width.value / 2, outputY - 38, colors.line);
    context.fillStyle = colors.text;
    context.fillText(`输出：O ${(current.value.probabilities[0] * 100).toFixed(1)}% · X ${(current.value.probabilities[1] * 100).toFixed(1)}%`, width.value / 2, outputY);
  }
}

function canvasPointer(event: PointerEvent) {
  const rect = canvas.value?.getBoundingClientRect();
  if (!rect) return;
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const currentLayout = layout();
  if (x < currentLayout.gridX || x >= currentLayout.gridX + currentLayout.gridSize || y < currentLayout.gridY || y >= currentLayout.gridY + currentLayout.gridSize) return;
  const column = Math.floor((x - currentLayout.gridX) / (currentLayout.gridSize / size));
  const row = Math.floor((y - currentLayout.gridY) / (currentLayout.gridSize / size));
  toggle(row * size + column);
}

function canvasKeydown(event: KeyboardEvent) {
  const movements: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -size, ArrowDown: size };
  if (event.key in movements) {
    event.preventDefault();
    selectedCell.value = Math.max(0, Math.min(inputSize - 1, selectedCell.value + movements[event.key]));
  } else if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    toggle(selectedCell.value);
  }
}

initialize();
watch([pixels, epoch, selectedCell, isDark], () => nextTick(draw), { deep: true });

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    width.value = Math.max(300, Math.floor(entry.contentRect.width));
    draw();
  });
  if (host.value) observer.observe(host.value);
  draw();
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <figure ref="host" class="interactive-card mlp-dot-demo">
    <figcaption>点阵分类：观察 MLP 怎样形成隐藏表示</figcaption>
    <canvas
      ref="canvas"
      tabindex="0"
      role="img"
      :aria-label="`可编辑的 5 乘 5 点阵。当前预测 ${predictedLabel}，置信度 ${(confidence * 100).toFixed(1)}%，已训练 ${epoch} 轮。方向键选择像素，空格切换。`"
      @pointerdown="canvasPointer"
      @keydown="canvasKeydown"
    />
    <div class="mlp-dot-demo__status" aria-live="polite">
      <span><b>训练轮数</b>{{ epoch }}</span>
      <span><b>平均 loss</b>{{ averageLoss.toFixed(4) }}</span>
      <span><b>当前预测</b>{{ predictedLabel }} · {{ (confidence * 100).toFixed(1) }}%</span>
    </div>
    <div class="interactive-controls">
      <button type="button" class="secondary" @click="choose('O')">载入 O</button>
      <button type="button" class="secondary" @click="choose('X')">载入 X</button>
      <button type="button" @click="train(1)">训练 1 轮</button>
      <button type="button" @click="train(100)">训练 100 轮</button>
      <button type="button" class="secondary" @click="reset">重置网络</button>
    </div>
    <p class="interactive-note">
      先重置观察随机预测，再训练 100 轮；然后点击像素制造噪声。每个隐藏圆点都读取全部 25 个输入，蓝色表示正激活，橙色表示负激活，颜色越深代表绝对值越大。
    </p>
    <p class="mlp-dot-demo__fallback interactive-fallback">5×5 点阵展平为 25 个数，经过 6 个隐藏激活得到 O/X 两个概率。训练通过降低交叉熵改变两组权重；点阵不是在层间移动，而是被逐层重新编码成新的数值向量。</p>
  </figure>
</template>

<style scoped>
.mlp-dot-demo canvas { display: block; width: 100%; background: var(--vp-c-bg); outline: none; touch-action: manipulation; }
.mlp-dot-demo canvas:focus-visible { box-shadow: inset 0 0 0 2px var(--vp-c-brand-1); }
.mlp-dot-demo__status { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.mlp-dot-demo__status span { display: grid; gap: 2px; padding: 10px 14px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); font-size: 13px; }
.mlp-dot-demo__status span + span { border-left: 1px solid var(--vp-c-divider); }
.mlp-dot-demo__status b { color: var(--vp-c-text-2); font-family: var(--vp-font-family-base); font-size: 11px; font-weight: 500; }
@media (max-width: 600px) {
  .mlp-dot-demo__status { grid-template-columns: 1fr; }
  .mlp-dot-demo__status span + span { border-top: 1px solid var(--vp-c-divider); border-left: 0; }
}
</style>
