<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
  >
    <div class="text-center max-w-md">
      <div
        v-if="error?.statusCode === 404"
        class="mb-8"
      >
        <div class="text-8xl font-bold text-orange-500 mb-4">404</div>
        <Icon name="material-symbols:search-off" class="text-6xl text-gray-300 mb-4" />
      </div>
      <div v-else class="mb-8">
        <Icon name="material-symbols:error-outline" class="text-6xl text-orange-500 mb-4" />
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-3">
        {{
          error?.statusCode === 404
            ? $t("page.error.404.title")
            : $t("page.error.general.title")
        }}
      </h1>
      <p class="text-gray-500 mb-8">
        {{
          error?.statusCode === 404
            ? $t("page.error.404.subtitle")
            : $t("page.error.general.subtitle")
        }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Trubutton
          :text="$t('page.error.404.backHome')"
          type="primary"
          size="medium"
          variant="solid"
          icon="material-symbols:home"
          @click="navigateTo('/')"
        />
        <Trubutton
          v-if="error?.statusCode !== 404"
          :text="$t('page.error.general.retry')"
          type="primary"
          size="medium"
          variant="outline"
          icon="material-symbols:refresh"
          @click="handleRetry"
        />
        <Trubutton
          :text="$t('page.error.404.goBack')"
          type="default"
          size="medium"
          variant="outline"
          icon="material-symbols:arrow-back"
          @click="handleGoBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();

useHead({
  title: props.error?.statusCode === 404 ? "404" : "Error",
  titleTemplate: "%s | Trumecs.com",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const handleRetry = () => {
  clearError({ redirect: "/" });
};

const handleGoBack = () => {
  if (process.client) {
    window.history.back();
  } else {
    navigateTo("/");
  }
};
</script>
