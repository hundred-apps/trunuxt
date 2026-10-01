<script lang="ts" setup>
import { ref, toRef, watch, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps({
  type: {
    type: String,
    default: "dropdown-right-top",
  },
});

const currentStyle = toRef(props, "type");

// Data bahasa dengan flag
const availableLang = [
  { key: "id", flag: "flag:id-4x3", label: "ID" },
  { key: "en", flag: "flag:gb-4x3", label: "EN" },
  { key: "zh", flag: "flag:cn-4x3", label: "ZH" },
];

// Domain mapping untuk multi-domain
const domainMap: Record<string, string> = {
  id: "trumecs.com",
  en: "en.trumecs.com",
  zh: "zh.trumecs.com",
};

const { locale, setLocale, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

// State untuk selected language
const selectedLang = ref(locale.value);
const isOpen = ref(false);
const isClient = ref(false);

// Get current language data
const currentLang = computed(() => {
  return (
    availableLang.find((lang) => lang.key === locale.value) || availableLang[0]
  );
});

// Sinkronisasi dari locale ke selectedLang
watch(locale, (newLocale) => {
  selectedLang.value = newLocale;
});

// Deteksi apakah di production dengan multi-domain
const isMultiDomain = computed(() => {
  if (!isClient.value) return false;
  const hostname = window.location.hostname;
  return hostname !== "localhost" && hostname !== "127.0.0.1";
});

// Fungsi untuk mengganti bahasa
const switchLanguage = async (langKey: string) => {
  if (langKey === locale.value) return;

  try {
    await setLocale(langKey);
    selectedLang.value = langKey;

    // Untuk multi-domain di production
    if (isMultiDomain.value) {
      const targetDomain = domainMap[langKey];
      const currentHost = window.location.hostname;

      if (targetDomain && currentHost !== targetDomain) {
        // Redirect ke domain yang sesuai
        const currentPath = window.location.pathname + window.location.search;
        const newUrl = `https://${targetDomain}${currentPath}`;
        window.location.href = newUrl;
        return;
      }
    }

    // Fallback: gunakan router push (untuk localhost / prefix strategy)
    const path = switchLocalePath(langKey);
    if (path) {
      await router.push(path);
    }
  } catch (error) {
    console.error("Error switching language:", error);
  }
};

// Function to get language name from i18n
const getLanguageName = (key: string) => {
  return t(`languages.${key}`);
};

onMounted(() => {
  isClient.value = true;
});
</script>

<template>
  <div class="flex items-center">
    <!-- Dropdown Version -->
    <HeadlessListbox
      v-if="currentStyle === 'dropdown-right-top'"
      v-model="selectedLang"
      as="div"
      class="relative flex items-center"
      @update:model-value="switchLanguage"
    >
      <HeadlessListboxLabel class="sr-only">
        Select Language
      </HeadlessListboxLabel>

      <!-- Tombol dengan Bendera + Dropdown Icon -->
      <HeadlessListboxButton as="template">
        <Trubutton
          type="primary"
          variant="light"
          size="small"
          shape="round"
          @click="isOpen = !isOpen"
        >
          <div class="flex items-center gap-1.5">
            <!-- Flag -->
            <Icon
              :name="currentLang?.flag"
              class="text-base shrink-0 leading-none"
            />

            <!-- Language Code -->
            <span class="text-sm font-semibold leading-none">{{
              currentLang?.label
            }}</span>

            <!-- Dropdown Icon -->
            <Icon
              name="mdi:chevron-down"
              class="text-base shrink-0 leading-none text-orange-400 dark:text-orange-400/80 transition-transform duration-200"
              :class="{ 'rotate-180': isOpen }"
            />
          </div>
        </Trubutton>
      </HeadlessListboxButton>

      <!-- Dropdown Menu -->
      <HeadlessListboxOptions
        class="p-1 absolute z-50 origin-top-right top-full right-0 mt-1 outline-none bg-white rounded-lg ring-1 ring-gray-900/10 shadow-lg overflow-hidden w-48 py-1 text-sm dark:ring-0 dark:highlight-white/5"
        enter="transition duration-100 ease-out"
        enter-from="transform scale-95 opacity-0"
        enter-to="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leave-from="transform scale-100 opacity-100"
        leave-to="transform scale-95 opacity-0"
        @click="isOpen = false"
      >
        <HeadlessListboxOption
          v-for="lang in availableLang"
          :key="lang.key"
          :value="lang.key"
          as="template"
        >
          <li
            class="py-2 px-3 flex items-center gap-3 cursor-pointer rounded transition-colors"
            :class="{
              'text-orange-500 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/15':
                selectedLang === lang.key,
              'hover:bg-orange-50 dark:hover:bg-orange-500/10':
                selectedLang !== lang.key,
            }"
          >
            <!-- Flag -->
            <Icon :name="lang?.flag" class="text-base shrink-0 leading-none" />

            <!-- Language Name -->
            <span class="flex-1 leading-none">{{
              $t(`languages.${lang.key}`)
            }}</span>

            <!-- Checkmark untuk active language -->
            <Icon
              v-if="selectedLang === lang.key"
              name="mdi:check"
              class="text-orange-500 dark:text-orange-400 text-base shrink-0"
            />
          </li>
        </HeadlessListboxOption>
      </HeadlessListboxOptions>
    </HeadlessListbox>

    <!-- Select Box Version -->
    <select
      v-if="currentStyle === 'select-box'"
      v-model="selectedLang"
      @change="switchLanguage(selectedLang)"
      class="w-full px-3 pr-8 py-2 outline-none rounded-lg border bg-transparent text-gray-700 dark:text-gray-300 border-gray-900/10 dark:border-gray-50/[0.2] appearance-none cursor-pointer"
      style="
        background-repeat: no-repeat;
        background-position: right 8px center;
      "
    >
      <option v-for="lang in availableLang" :key="lang.key" :value="lang.key">
        {{ lang.flag }} {{ $t(`languages.${lang.key}`) }}
      </option>
    </select>

    <!-- Segmented Version (untuk sidebar/menu) -->
    <div
      v-if="currentStyle === 'segmented'"
      class="flex w-full items-center gap-1 rounded-xl bg-gray-100 p-1"
      role="tablist"
    >
      <button
        v-for="lang in availableLang"
        :key="lang.key"
        type="button"
        role="tab"
        :aria-selected="selectedLang === lang.key"
        class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200"
        :class="
          selectedLang === lang.key
            ? 'bg-white text-orange-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        "
        @click="switchLanguage(lang.key)"
      >
        <Icon :name="lang.flag" class="shrink-0 text-base leading-none" />
        <span class="leading-none">{{ lang.label }}</span>
      </button>
    </div>

    <!-- Simple Button Version -->
    <div v-if="currentStyle === 'simple'" class="flex gap-1">
      <Trubutton
        v-for="lang in availableLang"
        :key="lang.key"
        type="primary"
        :variant="selectedLang === lang.key ? 'solid' : 'ghost'"
        size="small"
        shape="round"
        @click="switchLanguage(lang.key)"
      >
        <span class="flex items-center gap-1.5">
          <Icon :name="lang.flag" class="rounded-sm" />
          <span class="text-sm font-medium">{{ lang.label }}</span>
        </span>
      </Trubutton>
    </div>
  </div>
</template>

<style scoped>
/* Dropdown animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Select box custom styling */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select::-ms-expand {
  display: none;
}
</style>
