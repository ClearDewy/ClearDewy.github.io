<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { motion, useReducedMotion } from "motion-v";

type Axis = {
  symbol: string;
  value: number;
  label: string;
  tone: string;
};

type Step = {
  title: string;
  reason: string;
  expression: string;
  axes: Axis[];
};

const B = 2;
const T = 4;
const C = 8;
const H = 2;
const D = C / H;

const steps: Step[] = [
  {
    title: "输入：每个 token 一个完整表示",
    reason: "B 条序列，每条 T 个 token，每个 token 有 C 个特征。",
    expression: "X  [B, T, C] = [2, 4, 8]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "T", value: T, label: "token", tone: "green" },
      { symbol: "C", value: C, label: "隐藏特征", tone: "violet" },
    ],
  },
  {
    title: "投影：为 Q 学出新的表示",
    reason: "Wq 为不同头学习不同的查询子空间；这里改变数值，不只是改 shape。",
    expression: "X @ Wq  [B,T,C] @ [C,H×D] → [B,T,H×D]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "T", value: T, label: "token", tone: "green" },
      { symbol: "H×D", value: H * D, label: "投影特征", tone: "violet" },
    ],
  },
  {
    title: "拆头：把一个轴解释成两个轴",
    reason: "C = H×D。reshape 不做乘加，也不丢元素，只改变我们观察数据的方式。",
    expression: "reshape  [B,T,H×D] → [B,T,H,D]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "T", value: T, label: "token", tone: "green" },
      { symbol: "H", value: H, label: "注意力头", tone: "orange" },
      { symbol: "D", value: D, label: "每头特征", tone: "violet" },
    ],
  },
  {
    title: "转置：把每个头变成独立矩阵",
    reason: "matmul 把最后两个轴当矩阵、前面的轴当批次，所以把 B、H 放在前面。转置改变轴顺序，不改变元素。",
    expression: "transpose  [B,T,H,D] → [B,H,T,D]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "H", value: H, label: "注意力头", tone: "orange" },
      { symbol: "T", value: T, label: "query token", tone: "green" },
      { symbol: "D", value: D, label: "每头特征", tone: "violet" },
    ],
  },
  {
    title: "相似度：每个 query 对所有 key 打分",
    reason: "对每个样本、每个头，执行 [T,D] @ [D,T]，得到 token 两两之间的分数。",
    expression: "Q @ Kᵀ  [B,H,T,D] @ [B,H,D,T] → [B,H,T,T]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "H", value: H, label: "注意力头", tone: "orange" },
      { symbol: "Tq", value: T, label: "query token", tone: "green" },
      { symbol: "Tk", value: T, label: "key token", tone: "teal" },
    ],
  },
  {
    title: "读取：权重对 Value 加权求和",
    reason: "[Tq,Tk] @ [Tk,D] 消去 key 轴，为每个 query 保留一个 D 维读取结果。",
    expression: "weights @ V  [B,H,Tq,Tk] @ [B,H,Tk,D] → [B,H,Tq,D]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "H", value: H, label: "注意力头", tone: "orange" },
      { symbol: "Tq", value: T, label: "query token", tone: "green" },
      { symbol: "D", value: D, label: "每头输出", tone: "violet" },
    ],
  },
  {
    title: "换轴：让 token 再次位于 head 前面",
    reason: "转置只恢复轴顺序，不改变各头已经算出的输出数值。",
    expression: "transpose  [B,H,T,D] → [B,T,H,D]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "T", value: T, label: "query token", tone: "green" },
      { symbol: "H", value: H, label: "注意力头", tone: "orange" },
      { symbol: "D", value: D, label: "每头输出", tone: "violet" },
    ],
  },
  {
    title: "合并：拼接多个头并做输出投影",
    reason: "reshape 合并 H、D 为 C；随后 Wo 再次混合各头特征，输出恢复为 residual 可相加的 [B,T,C]。",
    expression: "reshape + Wo  [B,T,H,D] → [B,T,C] @ [C,C] → [B,T,C]",
    axes: [
      { symbol: "B", value: B, label: "样本", tone: "blue" },
      { symbol: "T", value: T, label: "query token", tone: "green" },
      { symbol: "C", value: C, label: "合并特征", tone: "violet" },
    ],
  },
];

const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
const reducedMotion = useReducedMotion();
const step = computed(() => steps[current.value]);

function stop() {
  playing.value = false;
  if (timer) clearInterval(timer);
  timer = undefined;
}

function previous() {
  current.value = Math.max(0, current.value - 1);
}

function next() {
  current.value = Math.min(steps.length - 1, current.value + 1);
}

function play() {
  if (playing.value) return stop();
  if (current.value === steps.length - 1) current.value = 0;
  playing.value = true;
  timer = setInterval(() => {
    if (current.value === steps.length - 1) return stop();
    current.value += 1;
  }, 1500);
}

function reset() {
  stop();
  current.value = 0;
}

onBeforeUnmount(stop);
</script>

<template>
  <figure class="interactive-card attention-shape-demo">
    <figcaption>多头注意力：投影、拆头、转置与矩阵乘法</figcaption>

    <div class="attention-shape-demo__body">
      <ol class="attention-shape-demo__progress" aria-label="演示步骤">
        <li
          v-for="(item, index) in steps"
          :key="item.title"
          :class="{ active: index === current, complete: index < current }"
        >
          <button type="button" :aria-current="index === current ? 'step' : undefined" @click="current = index">
            {{ index + 1 }}
          </button>
        </li>
      </ol>

      <div class="attention-shape-demo__explanation" aria-live="polite">
        <strong>{{ step.title }}</strong>
        <p>{{ step.reason }}</p>
      </div>

      <div class="attention-shape-demo__axes" :aria-label="step.expression">
        <motion.div
          v-for="axis in step.axes"
          :key="axis.symbol"
          class="attention-shape-demo__axis"
          :class="`is-${axis.tone}`"
          :initial="reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: reducedMotion ? 0 : 0.22 }"
        >
          <span>{{ axis.symbol }}</span>
          <b>{{ axis.value }}</b>
          <small>{{ axis.label }}</small>
        </motion.div>
      </div>

      <code class="attention-shape-demo__expression">{{ step.expression }}</code>
      <p class="interactive-note">元素数检查：输入 Q 有 {{ B }}×{{ T }}×{{ C }} = {{ B * T * C }} 个元素；拆头和转置后仍然相同。</p>
    </div>

    <div class="interactive-controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="previous">上一步</button>
      <button type="button" :disabled="current === steps.length - 1" @click="next">下一步</button>
      <button type="button" class="secondary" @click="play">{{ playing ? '暂停' : '播放' }}</button>
      <button type="button" class="secondary" @click="reset">重置</button>
      <span>步骤 {{ current + 1 }} / {{ steps.length }}</span>
    </div>
    <p class="attention-shape-demo__fallback interactive-fallback">静态路径：`[B,T,C] → [B,H,T,D] → scores [B,H,T,T] → heads [B,H,T,D] → [B,T,C]`。</p>
  </figure>
</template>

<style scoped>
.attention-shape-demo__body {
  padding: 18px 16px 2px;
}

.attention-shape-demo__progress {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin: 0 0 20px;
  padding: 0;
  list-style: none;
}

.attention-shape-demo__progress li {
  position: relative;
  display: grid;
  place-items: center;
}

.attention-shape-demo__progress li:not(:last-child)::after {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: calc(50% + 18px);
  width: calc(100% - 28px);
  height: 2px;
  background: var(--vp-c-divider);
  content: "";
}

.attention-shape-demo__progress li.complete:not(:last-child)::after {
  background: var(--vp-c-brand-1);
}

.attention-shape-demo__progress button {
  position: relative;
  z-index: 1;
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  place-items: center;
  border: 2px solid var(--vp-c-divider);
  border-radius: 50%;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  cursor: pointer;
  font-weight: 700;
}

.attention-shape-demo__progress li.active button,
.attention-shape-demo__progress li.complete button {
  border-color: var(--vp-c-brand-1);
  color: white;
  background: var(--vp-c-brand-1);
}

.attention-shape-demo__explanation {
  min-height: 76px;
}

.attention-shape-demo__explanation strong {
  color: var(--vp-c-text-1);
  font-size: 17px;
}

.attention-shape-demo__explanation p {
  margin: 6px 0 0;
  color: var(--vp-c-text-2);
}

.attention-shape-demo__axes {
  display: flex;
  min-height: 116px;
  align-items: stretch;
  justify-content: center;
  gap: 10px;
  padding: 14px 0;
}

.attention-shape-demo__axis {
  display: grid;
  min-width: 90px;
  padding: 12px 14px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--axis-color), transparent 55%);
  border-radius: 12px;
  background: color-mix(in srgb, var(--axis-color), transparent 88%);
}

.attention-shape-demo__axis span {
  color: var(--axis-color);
  font-weight: 800;
}

.attention-shape-demo__axis b {
  color: var(--vp-c-text-1);
  font-size: 24px;
}

.attention-shape-demo__axis small {
  color: var(--vp-c-text-2);
}

.attention-shape-demo__axis.is-blue { --axis-color: #2563eb; }
.attention-shape-demo__axis.is-green { --axis-color: #16a34a; }
.attention-shape-demo__axis.is-teal { --axis-color: #0d9488; }
.attention-shape-demo__axis.is-orange { --axis-color: #ea580c; }
.attention-shape-demo__axis.is-violet { --axis-color: #7c3aed; }

.attention-shape-demo__expression {
  display: block;
  overflow-x: auto;
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  text-align: center;
  white-space: nowrap;
}

.attention-shape-demo .interactive-note {
  padding: 10px 0 14px;
  text-align: center;
}

.interactive-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.attention-shape-demo__fallback {
  margin: 0;
  padding: 0 16px 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

@media (max-width: 640px) {
  .attention-shape-demo__progress {
    grid-template-columns: repeat(4, 1fr);
  }

  .attention-shape-demo__progress li:nth-child(4n)::after {
    display: none;
  }

  .attention-shape-demo__axes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .attention-shape-demo__axis {
    min-width: 0;
  }
}
</style>
