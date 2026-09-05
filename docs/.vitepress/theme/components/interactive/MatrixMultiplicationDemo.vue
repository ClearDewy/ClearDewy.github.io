<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { matmul, type Matrix } from "../../visualizations/model/matrix-math";

type EditableMatrix = "A" | "B";
const defaults: Record<EditableMatrix, Matrix> = {
  A: [[1, 2, 3], [4, 5, 6]],
  B: [[7, 8], [9, 10], [11, 12]],
};
const A = ref<Matrix>(structuredClone(defaults.A));
const B = ref<Matrix>(structuredClone(defaults.B));
const C = computed(() => matmul(A.value, B.value));
const steps = Array.from({ length: 12 }, (_, index) => {
  const output = Math.floor(index / 3);
  return { row: Math.floor(output / 2), column: output % 2, inner: index % 3 };
});

const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
const step = computed(() => steps[current.value]);
const terms = computed(() =>
  Array.from({ length: step.value.inner + 1 }, (_, i) => `${A.value[step.value.row][i]}×${B.value[i][step.value.column]}`),
);
const partial = computed(() =>
  Array.from({ length: step.value.inner + 1 }, (_, i) => A.value[step.value.row][i] * B.value[i][step.value.column])
    .reduce((sum, value) => sum + value, 0),
);

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
  }, 900);
}

function reset() {
  stop();
  current.value = 0;
}

function updateCell(matrixName: EditableMatrix, row: number, column: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.value.trim()) return;
  const parsed = Number(input.value);
  if (!Number.isFinite(parsed)) return;
  const value = Math.max(-99, Math.min(99, parsed));
  const matrix = (matrixName === "A" ? A.value : B.value).map((items) => [...items]);
  matrix[row][column] = value;
  if (matrixName === "A") A.value = matrix;
  else B.value = matrix;
  input.value = String(value);
  stop();
}

function restoreCell(matrixName: EditableMatrix, row: number, column: number, event: Event) {
  const matrix = matrixName === "A" ? A.value : B.value;
  (event.target as HTMLInputElement).value = String(matrix[row][column]);
}

function restoreExample() {
  A.value = structuredClone(defaults.A);
  B.value = structuredClone(defaults.B);
  stop();
  current.value = 0;
}

onBeforeUnmount(stop);
</script>

<template>
  <figure class="interactive-card matrix-demo">
    <figcaption>
      <span>矩阵乘法：一行与一列怎样生成一个输出元素</span>
      <span class="matrix-demo__caption-tools"><small>A/B 可直接编辑</small><button type="button" @click="restoreExample">恢复数值</button></span>
    </figcaption>

    <div class="matrix-demo__progress" aria-label="计算进度">
      <button
        v-for="(item, index) in steps"
        :key="index"
        type="button"
        :class="{ active: index === current, complete: index < current }"
        :aria-label="`第 ${index + 1} 个乘积项`"
        :aria-current="index === current ? 'step' : undefined"
        @click="go(index)"
      >
        C{{ item.row + 1 }}{{ item.column + 1 }} · {{ item.inner + 1 }}
      </button>
    </div>

    <div class="matrix-demo__stage">
      <section>
        <strong>A · 第 {{ step.row + 1 }} 行</strong>
        <table aria-label="矩阵 A">
          <tbody>
            <tr v-for="(row, rowIndex) in A" :key="rowIndex">
              <td
                v-for="(value, columnIndex) in row"
                :key="columnIndex"
                :class="{ source: rowIndex === step.row, current: rowIndex === step.row && columnIndex === step.inner }"
              >
                <input
                  type="number"
                  min="-99"
                  max="99"
                  step="0.1"
                  :value="value"
                  :aria-label="`A 第 ${rowIndex + 1} 行第 ${columnIndex + 1} 列`"
                  @input="updateCell('A', rowIndex, columnIndex, $event)"
                  @blur="restoreCell('A', rowIndex, columnIndex, $event)"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <span class="matrix-demo__operator" aria-hidden="true">×</span>

      <section>
        <strong>B · 第 {{ step.column + 1 }} 列</strong>
        <table aria-label="矩阵 B">
          <tbody>
            <tr v-for="(row, rowIndex) in B" :key="rowIndex">
              <td
                v-for="(value, columnIndex) in row"
                :key="columnIndex"
                :class="{ source: columnIndex === step.column, current: columnIndex === step.column && rowIndex === step.inner }"
              >
                <input
                  type="number"
                  min="-99"
                  max="99"
                  step="0.1"
                  :value="value"
                  :aria-label="`B 第 ${rowIndex + 1} 行第 ${columnIndex + 1} 列`"
                  @input="updateCell('B', rowIndex, columnIndex, $event)"
                  @blur="restoreCell('B', rowIndex, columnIndex, $event)"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <span class="matrix-demo__operator" aria-hidden="true">=</span>

      <section>
        <strong>C = A × B</strong>
        <table aria-label="结果矩阵 C">
          <tbody>
            <tr v-for="(row, rowIndex) in C" :key="rowIndex">
              <td
                v-for="(value, columnIndex) in row"
                :key="columnIndex"
                :class="{ target: rowIndex === step.row && columnIndex === step.column }"
              >
                {{ rowIndex * 2 + columnIndex < Math.floor(current / 3) ? value : rowIndex === step.row && columnIndex === step.column ? partial : '·' }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div class="matrix-demo__explanation" aria-live="polite">
      <code>C[{{ step.row }},{{ step.column }}] = {{ terms.join(' + ') }} = {{ partial }}</code>
      <p>蓝色锁定输出所需的整行和整列；深色方格是当前乘积项。三个乘积项累加后，才得到一个 C 元素。</p>
    </div>

    <div class="interactive-controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" :disabled="current === steps.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="play">{{ playing ? '暂停' : '播放' }}</button>
      <button type="button" class="secondary" @click="reset">回到开头</button>
      <span>乘积项 {{ current + 1 }} / {{ steps.length }}</span>
    </div>

    <p class="matrix-demo__fallback interactive-fallback">矩阵 A 的一行与矩阵 B 的一列逐项相乘并求和，得到 C 的一个元素；当前 shape 为 [2,3] × [3,2] → [2,2]。</p>
  </figure>
</template>

<style scoped>
.matrix-demo > figcaption { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.matrix-demo__caption-tools { display: flex; align-items: center; gap: 9px; }
.matrix-demo__caption-tools small { color: var(--vp-c-text-2); font-size: 11px; font-weight: 500; }
.matrix-demo__caption-tools button { padding: 4px 8px; border: 1px solid var(--vp-c-divider); border-radius: 6px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; font-size: 11px; }
.matrix-demo__progress { display: grid; grid-template-columns: repeat(12, 1fr); gap: 5px; padding: 16px 16px 0; }
.matrix-demo__progress button { min-width: 0; padding: 5px 2px; border: 1px solid var(--vp-c-divider); border-radius: 7px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; font-size: 10px; white-space: nowrap; }
.matrix-demo__progress button.complete { border-color: color-mix(in srgb, var(--vp-c-brand-1), transparent 55%); background: color-mix(in srgb, var(--vp-c-brand-1), transparent 90%); }
.matrix-demo__progress button.active { border-color: var(--vp-c-brand-1); color: white; background: var(--vp-c-brand-1); }
.matrix-demo__stage { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 20px; padding: 30px 20px 20px; text-align: center; }
.matrix-demo__stage section { display: grid; justify-items: center; gap: 12px; }
.matrix-demo__stage strong { min-height: 24px; }
.matrix-demo__stage table { border-collapse: separate; border-spacing: 6px; margin: 0; }
.matrix-demo__stage td { width: 52px; height: 48px; padding: 0; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--vp-c-bg); text-align: center; transition: background .18s ease, border-color .18s ease, transform .18s ease; }
.matrix-demo__stage td input { box-sizing: border-box; width: 100%; height: 100%; padding: 0 3px; border: 0; border-radius: inherit; outline: 0; color: inherit; background: transparent; font: inherit; text-align: center; appearance: textfield; }
.matrix-demo__stage td input::-webkit-inner-spin-button,
.matrix-demo__stage td input::-webkit-outer-spin-button { margin: 0; appearance: none; }
.matrix-demo__stage td:focus-within { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 2px color-mix(in srgb, var(--vp-c-brand-1), transparent 75%); }
.matrix-demo__stage td.source { border-color: color-mix(in srgb, var(--vp-c-brand-1), transparent 50%); background: color-mix(in srgb, var(--vp-c-brand-1), transparent 90%); }
.matrix-demo__stage td.current { border-color: var(--vp-c-brand-1); color: white; background: var(--vp-c-brand-1); transform: scale(1.06); }
.matrix-demo__stage td.target { border-color: #ea580c; color: #c2410c; background: color-mix(in srgb, #f97316, transparent 88%); font-weight: 800; }
.matrix-demo__operator { color: var(--vp-c-text-2); font-size: 28px; }
.matrix-demo__explanation { margin: 0 16px 16px; padding: 14px; border-radius: 10px; background: var(--vp-c-bg-soft); text-align: center; }
.matrix-demo__explanation code { font-size: 16px; }
.matrix-demo__explanation p, .matrix-demo__fallback { margin: 8px 0 0; color: var(--vp-c-text-2); }
.matrix-demo__fallback { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; white-space: nowrap; }
.interactive-controls button:disabled { cursor: not-allowed; opacity: .45; }
@media (max-width: 720px) {
  .matrix-demo > figcaption { align-items: flex-start; flex-direction: column; }
  .matrix-demo__stage { grid-template-columns: 1fr; }
  .matrix-demo__operator { transform: rotate(90deg); }
  .matrix-demo__progress { grid-template-columns: repeat(6, 1fr); }
}
@media (prefers-reduced-motion: reduce) { .matrix-demo__stage td { transition: none; } }
</style>
