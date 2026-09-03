<script setup lang="ts">
import Teek from "vitepress-theme-teek";
import KnowledgeOrbit from "./components/KnowledgeOrbit.vue";

const { Layout } = Teek;
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <KnowledgeOrbit />
    </template>
  </Layout>
</template>
