<script setup lang="ts">
import { computed } from "vue";
import { hierarchy, tree } from "d3";

type TreeNode = {
  name: string;
  children?: TreeNode[];
};

const props = withDefaults(
  defineProps<{
    data?: TreeNode;
    title?: string;
  }>(),
  {
    title: "D3 知识树",
    data: () => ({
      name: "智能系统",
      children: [
        { name: "模型", children: [{ name: "传统模型" }, { name: "LLM" }] },
        { name: "Harness", children: [{ name: "工具" }, { name: "记忆" }, { name: "评测" }] },
      ],
    }),
  },
);

const width = 680;
const height = 340;

const layout = computed(() => {
  const root = hierarchy(props.data);
  tree<TreeNode>().size([height - 72, width - 190])(root);
  return {
    nodes: root.descendants(),
    links: root.links(),
  };
});
</script>

<template>
  <figure class="interactive-card d3-tree">
    <figcaption>{{ title }}</figcaption>
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" :aria-label="title">
      <g transform="translate(80,36)">
        <path
          v-for="(link, index) in layout.links"
          :key="`link-${index}`"
          class="d3-tree__link"
          :d="`M${link.source.y},${link.source.x} C${(link.source.y + link.target.y) / 2},${link.source.x} ${(link.source.y + link.target.y) / 2},${link.target.x} ${link.target.y},${link.target.x}`"
        />
        <g
          v-for="node in layout.nodes"
          :key="`${node.depth}-${node.data.name}`"
          class="d3-tree__node"
          :transform="`translate(${node.y},${node.x})`"
        >
          <circle r="7" />
          <text :x="node.children ? -12 : 12" dy="0.32em" :text-anchor="node.children ? 'end' : 'start'">
            {{ node.data.name }}
          </text>
        </g>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.d3-tree svg {
  display: block;
  width: 100%;
  min-height: 260px;
}

.d3-tree__link {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 2;
}

.d3-tree__node circle {
  fill: var(--vp-c-brand-1);
  stroke: var(--vp-c-bg);
  stroke-width: 3;
}

.d3-tree__node text {
  fill: var(--vp-c-text-1);
  font-size: 13px;
}
</style>
