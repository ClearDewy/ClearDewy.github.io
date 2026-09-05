<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

type Phase = "准备" | "前向" | "反向" | "更新";
type Step = {
  phase: Phase;
  short: string;
  title: string;
  formula: string;
  detail: string;
  why: string;
  nodes: string[];
  edges: string[];
  direction?: "forward" | "backward";
};

const steps: Step[] = [
  {
    phase: "准备", short: "建图", title: "把复合函数拆成局部运算",
    formula: "a=wx，b=a²，c=3a，L=b+c",
    detail: "圆角方框保存变量，箭头表示变量之间的直接依赖。a 被 b、c 两条分支共同使用。",
    why: "拆开后，每条边只需要处理一个简单局部导数。",
    nodes: ["w", "x"], edges: [],
  },
  {
    phase: "前向", short: "算 a", title: "输入经过乘法节点",
    formula: "a = w×x = 2×4 = 8",
    detail: "先用参数 w 和常量 x 得到共享中间量 a，并把 a=8 缓存下来。",
    why: "反向经过平方节点时需要用到前向值 a。",
    nodes: ["w", "x", "a"], edges: ["wa", "xa"], direction: "forward",
  },
  {
    phase: "前向", short: "算 b", title: "上分支计算平方",
    formula: "b = a² = 8² = 64",
    detail: "a 沿上分支进入平方运算，得到 b=64。",
    why: "这条分支对 a 的局部导数是 ∂b/∂a=2a。",
    nodes: ["a", "b"], edges: ["ab"], direction: "forward",
  },
  {
    phase: "前向", short: "算 c", title: "下分支计算三倍",
    formula: "c = 3a = 3×8 = 24",
    detail: "同一个 a 也沿下分支参与另一个运算，得到 c=24。",
    why: "一个变量被多处使用，反向时必须收齐所有下游贡献。",
    nodes: ["a", "c"], edges: ["ac"], direction: "forward",
  },
  {
    phase: "前向", short: "算 L", title: "两条分支汇合为最终损失",
    formula: "L = b+c = 64+24 = 88",
    detail: "前向传播完成。此时已保存 a=8、b=64、c=24，供反向传播复用。",
    why: "反向传播从一个标量目标 L 出发，才能衡量参数改变对目标的影响。",
    nodes: ["b", "c", "L"], edges: ["bL", "cL"], direction: "forward",
  },
  {
    phase: "反向", short: "种子", title: "给输出梯度设置起点",
    formula: "∂L/∂L = 1",
    detail: "L 对自身变化率恒为 1。这个 1 是反向传播的种子，也叫初始上游梯度。",
    why: "没有这个起点，链式法则就没有可以向前一层传递的量。",
    nodes: ["L"], edges: [], direction: "backward",
  },
  {
    phase: "反向", short: "过加法", title: "加法把梯度原样发给两条分支",
    formula: "∂L/∂b = 1，∂L/∂c = 1",
    detail: "因为 L=b+c，所以 b 或 c 单独增加 1，L 都增加 1。",
    why: "反向传播不是把一个梯度二选一地分走；每条依赖路径都会收到自己的梯度。",
    nodes: ["L", "b", "c"], edges: ["bL", "cL"], direction: "backward",
  },
  {
    phase: "反向", short: "平方支", title: "上分支应用链式法则",
    formula: "来自 b 的贡献 = (∂L/∂b)(∂b/∂a) = 1×2a = 16",
    detail: "上游梯度是 1，平方运算的局部导数是 2a；复用前向缓存 a=8，得到贡献 16。",
    why: "每个节点只做“上游梯度 × 局部导数”，不必重新展开整个函数。",
    nodes: ["b", "a"], edges: ["ab"], direction: "backward",
  },
  {
    phase: "反向", short: "三倍支", title: "下分支也产生一份贡献",
    formula: "来自 c 的贡献 = (∂L/∂c)(∂c/∂a) = 1×3 = 3",
    detail: "三倍运算的局部导数恒为 3，因此下分支给 a 返回贡献 3。",
    why: "两条贡献都源自 a 对 L 的真实影响，任何一条都不能丢。",
    nodes: ["c", "a"], edges: ["ac"], direction: "backward",
  },
  {
    phase: "反向", short: "汇合", title: "共享变量处累加全部路径",
    formula: "∂L/∂a = 16+3 = 19",
    detail: "a 同时影响 b 和 c，因此它的总梯度等于两条路径贡献之和。",
    why: "梯度是总变化率；一个变量经过多少条路径影响目标，就要累加多少条路径。",
    nodes: ["b", "c", "a"], edges: ["ab", "ac"], direction: "backward",
  },
  {
    phase: "反向", short: "到 w", title: "继续传播到待优化参数",
    formula: "∂L/∂w = (∂L/∂a)(∂a/∂w) = 19×x = 19×4 = 76",
    detail: "乘法 a=wx 对 w 的局部导数是 x。x=4，所以参数 w 的梯度为 76。",
    why: "76 表示在当前点附近，w 每增加一个很小单位，L 约增加 76 倍的小单位。",
    nodes: ["a", "x", "w"], edges: ["wa"], direction: "backward",
  },
  {
    phase: "更新", short: "更新", title: "优化器使用梯度修改参数",
    formula: "若 η=0.01：w′ = w-η·∂L/∂w = 2-0.01×76 = 1.24",
    detail: "反向传播到得到梯度 76 就结束了；减去多少、是否裁剪或使用动量，是优化器的职责。",
    why: "把求梯度和改参数分开，才能复用不同优化算法并正确控制更新时机。",
    nodes: ["w"], edges: [],
  },
];

const graphNodes = [
  { id: "w", label: "参数 w", x: 30, y: 54, valueAt: 0, value: "2", gradientAt: 10, gradient: "76" },
  { id: "x", label: "常量 x", x: 30, y: 246, valueAt: 0, value: "4", gradientAt: 99, gradient: "" },
  { id: "a", label: "中间量 a", x: 245, y: 150, valueAt: 1, value: "8", gradientAt: 9, gradient: "19" },
  { id: "b", label: "分支 b", x: 455, y: 54, valueAt: 2, value: "64", gradientAt: 6, gradient: "1" },
  { id: "c", label: "分支 c", x: 455, y: 246, valueAt: 3, value: "24", gradientAt: 6, gradient: "1" },
  { id: "L", label: "损失 L", x: 665, y: 150, valueAt: 4, value: "88", gradientAt: 5, gradient: "1" },
];

const edges = [
  { id: "wa", x1: 160, y1: 86, x2: 245, y2: 174, label: "×", lx: 195, ly: 119 },
  { id: "xa", x1: 160, y1: 278, x2: 245, y2: 190, label: "×", lx: 195, ly: 251 },
  { id: "ab", x1: 375, y1: 174, x2: 455, y2: 86, label: "square", lx: 414, ly: 119 },
  { id: "ac", x1: 375, y1: 190, x2: 455, y2: 278, label: "×3", lx: 414, ly: 251 },
  { id: "bL", x1: 585, y1: 86, x2: 665, y2: 174, label: "+", lx: 625, ly: 119 },
  { id: "cL", x1: 585, y1: 278, x2: 665, y2: 190, label: "+", lx: 625, ly: 251 },
];

const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
const stage = computed(() => steps[current.value]);

function stop() {
  playing.value = false;
  if (timer) clearInterval(timer);
  timer = undefined;
}

function go(index: number) {
  current.value = Math.max(0, Math.min(steps.length - 1, index));
}

function play() {
  if (playing.value) return stop();
  if (current.value === steps.length - 1) current.value = 0;
  playing.value = true;
  timer = setInterval(() => {
    if (current.value === steps.length - 1) return stop();
    current.value += 1;
  }, 1900);
}

function reset() {
  stop();
  current.value = 0;
}

function isActiveNode(id: string) {
  return stage.value.nodes.includes(id);
}

onBeforeUnmount(stop);
</script>

<template>
  <figure class="interactive-card backprop-demo">
    <figcaption>反向传播：数值向右计算，梯度向左累加</figcaption>

    <ol class="backprop-demo__progress" aria-label="反向传播步骤">
      <li v-for="(item, index) in steps" :key="item.short">
        <button
          type="button"
          :class="{ active: index === current, complete: index < current, backward: item.phase === '反向' }"
          :aria-label="`步骤 ${index + 1}：${item.title}`"
          :aria-current="index === current ? 'step' : undefined"
          @click="go(index)"
        >
          <span>{{ index + 1 }}</span>{{ item.short }}
        </button>
      </li>
    </ol>

    <div class="backprop-demo__graph-scroll">
      <svg viewBox="0 0 825 350" role="img" :aria-label="stage.detail">
        <defs>
          <marker id="backprop-arrow-forward" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker id="backprop-arrow-backward" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <g v-for="edge in edges" :key="edge.id">
          <line class="backprop-demo__edge" :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2" />
          <line
            v-if="stage.edges.includes(edge.id)"
            :key="`${current}-${edge.id}`"
            class="backprop-demo__flow"
            :class="{ backward: stage.direction === 'backward' }"
            :x1="stage.direction === 'backward' ? edge.x2 : edge.x1"
            :y1="stage.direction === 'backward' ? edge.y2 : edge.y1"
            :x2="stage.direction === 'backward' ? edge.x1 : edge.x2"
            :y2="stage.direction === 'backward' ? edge.y1 : edge.y2"
            :marker-end="stage.direction === 'backward' ? 'url(#backprop-arrow-backward)' : 'url(#backprop-arrow-forward)'"
          />
          <text class="backprop-demo__edge-label" :x="edge.lx" :y="edge.ly">{{ edge.label }}</text>
        </g>

        <g
          v-for="node in graphNodes"
          :key="node.id"
          class="backprop-demo__node"
          :class="{ active: isActiveNode(node.id), backward: stage.phase === '反向' && isActiveNode(node.id), update: stage.phase === '更新' && isActiveNode(node.id) }"
          :transform="`translate(${node.x} ${node.y})`"
        >
          <rect width="130" height="64" rx="11" />
          <text class="backprop-demo__node-label" x="65" y="20">{{ node.label }}</text>
          <text class="backprop-demo__node-value" x="65" y="43">
            {{ current >= node.valueAt ? `值 ${node.value}` : '值 ?' }}
            <tspan v-if="current >= node.gradientAt" dx="8">梯度 {{ node.gradient }}</tspan>
          </text>
        </g>
      </svg>
    </div>

    <section class="backprop-demo__explanation" aria-live="polite">
      <div>
        <span class="backprop-demo__phase" :class="stage.phase">{{ stage.phase }}</span>
        <h3>{{ current + 1 }}. {{ stage.title }}</h3>
        <code>{{ stage.formula }}</code>
      </div>
      <div>
        <p><b>发生了什么：</b>{{ stage.detail }}</p>
        <p><b>为什么：</b>{{ stage.why }}</p>
      </div>
    </section>

    <div class="interactive-controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" :disabled="current === steps.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="play">{{ playing ? "暂停" : "播放" }}</button>
      <button type="button" class="secondary" @click="reset">重置</button>
      <span>步骤 {{ current + 1 }} / {{ steps.length }}</span>
    </div>
    <p class="backprop-demo__fallback interactive-fallback">静态路径：前向保存 `a=8,b=64,c=24,L=88`；反向从 `∂L/∂L=1` 开始，得到 `∂L/∂a=16+3=19`，最终 `∂L/∂w=19×4=76`。</p>
  </figure>
</template>

<style scoped>
.backprop-demo__progress { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; margin: 0; padding: 16px; list-style: none; }
.backprop-demo__progress li { margin: 0; }
.backprop-demo__progress button { width: 100%; padding: 7px 3px; border: 1px solid var(--vp-c-divider); border-radius: 8px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; font-size: 11px; }
.backprop-demo__progress button span { display: inline-grid; width: 20px; height: 20px; margin-right: 4px; place-items: center; border-radius: 50%; background: var(--vp-c-default-soft); font-weight: 700; }
.backprop-demo__progress button.complete { border-color: color-mix(in srgb, var(--vp-c-brand-1), transparent 60%); }
.backprop-demo__progress button.backward.complete { border-color: color-mix(in srgb, #d97706, transparent 60%); }
.backprop-demo__progress button.active { border-color: var(--vp-c-brand-1); color: white; background: var(--vp-c-brand-1); }
.backprop-demo__progress button.active.backward { border-color: #d97706; background: #d97706; }
.backprop-demo__progress button.active span { color: inherit; background: rgba(255,255,255,.18); }
.backprop-demo__graph-scroll { overflow-x: auto; border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.backprop-demo svg { display: block; min-width: 700px; width: 100%; }
.backprop-demo__edge { stroke: var(--vp-c-divider); stroke-width: 2; }
.backprop-demo__flow { stroke: var(--vp-c-brand-1); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 9 7; animation: backprop-flow .65s linear infinite; }
.backprop-demo__flow.backward { stroke: #d97706; }
#backprop-arrow-forward path { fill: var(--vp-c-brand-1); }
#backprop-arrow-backward path { fill: #d97706; }
.backprop-demo__edge-label { fill: var(--vp-c-text-2); font: 12px var(--vp-font-family-mono); text-anchor: middle; }
.backprop-demo__node rect { fill: var(--vp-c-bg-soft); stroke: var(--vp-c-divider); stroke-width: 1.5; transition: fill .2s, stroke .2s; }
.backprop-demo__node.active rect { fill: color-mix(in srgb, var(--vp-c-brand-1), transparent 90%); stroke: var(--vp-c-brand-1); stroke-width: 2.5; }
.backprop-demo__node.active.backward rect { fill: color-mix(in srgb, #d97706, transparent 90%); stroke: #d97706; }
.backprop-demo__node.active.update rect { fill: color-mix(in srgb, var(--vp-c-success-1), transparent 90%); stroke: var(--vp-c-success-1); }
.backprop-demo__node-label { fill: var(--vp-c-text-1); font: 600 13px var(--vp-font-family-base); text-anchor: middle; }
.backprop-demo__node-value { fill: var(--vp-c-text-2); font: 11px var(--vp-font-family-mono); text-anchor: middle; }
.backprop-demo__explanation { display: grid; grid-template-columns: minmax(240px,.8fr) minmax(0,1.2fr); gap: 24px; min-height: 178px; padding: 20px; background: var(--vp-c-bg-soft); }
.backprop-demo__explanation h3 { margin: 7px 0 12px; padding: 0; border: 0; font-size: 18px; }
.backprop-demo__explanation code { display: inline-block; color: var(--vp-c-text-1); font-size: 14px; white-space: normal; }
.backprop-demo__explanation p { margin: 4px 0 12px; color: var(--vp-c-text-2); }
.backprop-demo__phase { display: inline-block; padding: 3px 8px; border-radius: 999px; color: var(--vp-c-brand-1); background: color-mix(in srgb, var(--vp-c-brand-1), transparent 88%); font-size: 11px; font-weight: 700; }
.backprop-demo__phase.反向 { color: #b45309; background: color-mix(in srgb, #d97706, transparent 88%); }
.backprop-demo__phase.更新 { color: var(--vp-c-success-1); background: color-mix(in srgb, var(--vp-c-success-1), transparent 88%); }
.backprop-demo__fallback { margin: 0; padding: 0 16px 16px; color: var(--vp-c-text-2); font-size: 13px; }
.interactive-controls button:disabled { cursor: not-allowed; opacity: .45; }
@keyframes backprop-flow { to { stroke-dashoffset: -16; } }
@media (max-width: 700px) {
  .backprop-demo__progress { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .backprop-demo__explanation { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .backprop-demo__flow { animation: none; } .backprop-demo__node rect { transition: none; } }
</style>
