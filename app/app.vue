<script setup lang="js">
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "G-HC9L76FPRT");
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <el-config-provider>
      <NuxtPage />
    </el-config-provider>
  </NuxtLayout>
</template>
