<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <el-config-provider :locale="elementLocale">
      <NuxtPage />
    </el-config-provider>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import en from "element-plus/es/locale/lang/en";
import id from "element-plus/es/locale/lang/id";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const { locale } = useI18n();

// Samakan bahasa komponen Element Plus (pagination, dialog, dsb) dengan locale app
const elementLocale = computed(() => {
  const code = String(locale.value || "id").toLowerCase();
  if (code.startsWith("zh")) return zhCn;
  if (code.startsWith("en")) return en;
  return id;
});
</script>
