<!-- components/bess/BessIcons.vue -->
<template>
  <!-- SOLAR -->
  <svg
    v-if="name === 'solar'"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
    preserveAspectRatio="xMidYMax meet"
  >
    <circle cx="60" cy="40" r="18" fill="#FBBF24" />
    <g stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round">
      <line x1="60" y1="14" x2="60" y2="8" />
      <line x1="60" y1="66" x2="60" y2="72" />
      <line x1="34" y1="40" x2="28" y2="40" />
      <line x1="86" y1="40" x2="92" y2="40" />
      <line x1="41" y1="21" x2="37" y2="17" />
      <line x1="79" y1="59" x2="83" y2="63" />
      <line x1="79" y1="21" x2="83" y2="17" />
      <line x1="41" y1="59" x2="37" y2="63" />
    </g>
    <rect
      x="30"
      y="70"
      width="60"
      height="40"
      rx="4"
      fill="#2563EB"
      opacity="0.15"
      stroke="#2563EB"
      stroke-width="2"
    />
    <rect
      x="36"
      y="76"
      width="48"
      height="6"
      rx="2"
      fill="#2563EB"
      opacity="0.3"
    />
    <rect
      x="36"
      y="86"
      width="48"
      height="6"
      rx="2"
      fill="#2563EB"
      opacity="0.3"
    />
    <rect
      x="36"
      y="96"
      width="48"
      height="6"
      rx="2"
      fill="#2563EB"
      opacity="0.3"
    />
    <rect x="55" y="110" width="10" height="6" rx="1" fill="#9CA3AF" />
    <line x1="48" y1="116" x2="72" y2="116" stroke="#9CA3AF" stroke-width="2" />
  </svg>

  <!-- GRID -->
  <svg
    v-else-if="name === 'grid'"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
    preserveAspectRatio="xMidYMax meet"
  >
    <rect x="55" y="10" width="10" height="100" rx="2" fill="#6B7280" />
    <rect x="30" y="20" width="60" height="6" rx="2" fill="#6B7280" />
    <rect x="35" y="45" width="50" height="5" rx="2" fill="#6B7280" />
    <path
      d="M30 23 C20 10 10 15 10 25"
      stroke="#2563EB"
      stroke-width="2.5"
      stroke-linecap="round"
    />
    <path
      d="M30 23 C40 10 50 15 50 25"
      stroke="#2563EB"
      stroke-width="2.5"
      stroke-linecap="round"
    />
    <path
      d="M90 23 C100 10 110 15 110 25"
      stroke="#2563EB"
      stroke-width="2.5"
      stroke-linecap="round"
    />
    <path
      d="M58 43 L50 57 L60 53 L54 67"
      stroke="#FBBF24"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect x="45" y="105" width="30" height="6" rx="2" fill="#9CA3AF" />
    <line x1="55" y1="111" x2="55" y2="120" stroke="#9CA3AF" stroke-width="2" />
    <line x1="65" y1="111" x2="65" y2="120" stroke="#9CA3AF" stroke-width="2" />
  </svg>

  <!-- BESS - Tanpa Teks + BESS -->
  <svg
    v-else-if="name === 'bess'"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
    preserveAspectRatio="xMidYMax meet"
  >
    <!-- Body baterai - digeser ke bawah (+5) -->
    <rect
      x="30"
      y="30"
      width="60"
      height="85"
      rx="8"
      fill="#16A34A"
      opacity="0.15"
      stroke="#16A34A"
      stroke-width="2"
    />
    <!-- Atas baterai - digeser ke bawah (+5) -->
    <rect
      x="45"
      y="22"
      width="30"
      height="10"
      rx="3"
      fill="#16A34A"
      opacity="0.3"
      stroke="#16A34A"
      stroke-width="2"
    />
    <!-- Sel 1 - digeser ke bawah (+5) -->
    <rect
      x="38"
      y="36"
      width="10"
      height="73"
      rx="3"
      fill="#16A34A"
      opacity="0.6"
    />
    <!-- Sel 2 - digeser ke bawah (+5) -->
    <rect
      x="55"
      y="36"
      width="10"
      height="73"
      rx="3"
      fill="#16A34A"
      opacity="0.4"
    />
    <!-- Sel 3 - digeser ke bawah (+5) -->
    <rect
      x="72"
      y="36"
      width="10"
      height="73"
      rx="3"
      fill="#16A34A"
      opacity="0.2"
    />
    <!-- Lightning - digeser ke bawah (+5) -->
    <path
      d="M48 58 L42 70 L50 68 L45 78"
      stroke="#FBBF24"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- FACTORY -->
  <svg
    v-else-if="name === 'factory'"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
    preserveAspectRatio="xMidYMax meet"
  >
    <rect
      x="20"
      y="30"
      width="80"
      height="80"
      rx="4"
      fill="#6B7280"
      opacity="0.15"
      stroke="#6B7280"
      stroke-width="2"
    />
    <path
      d="M20 30 L60 10 L100 30"
      stroke="#6B7280"
      stroke-width="2.5"
      fill="#6B7280"
      opacity="0.1"
    />
    <rect
      x="70"
      y="13"
      width="10"
      height="22"
      rx="2"
      fill="#6B7280"
      opacity="0.4"
    />
    <circle cx="75" cy="7" r="4" fill="#9CA3AF" opacity="0.5" />
    <circle cx="80" cy="1" r="5" fill="#9CA3AF" opacity="0.3" />
    <rect
      x="28"
      y="40"
      width="12"
      height="10"
      rx="1"
      fill="#60A5FA"
      opacity="0.6"
    />
    <rect
      x="48"
      y="40"
      width="12"
      height="10"
      rx="1"
      fill="#60A5FA"
      opacity="0.6"
    />
    <rect
      x="68"
      y="40"
      width="12"
      height="10"
      rx="1"
      fill="#60A5FA"
      opacity="0.6"
    />
    <rect
      x="45"
      y="85"
      width="14"
      height="25"
      rx="2"
      fill="#9CA3AF"
      opacity="0.4"
    />
    <circle cx="95" cy="40" r="10" stroke="#16A34A" stroke-width="2" />
    <circle cx="95" cy="40" r="4" fill="#16A34A" opacity="0.5" />
  </svg>

  <!-- EV -->
  <svg
    v-else-if="name === 'ev'"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
    preserveAspectRatio="xMidYMax meet"
  >
    <rect
      x="20"
      y="60"
      width="70"
      height="35"
      rx="8"
      fill="#2563EB"
      opacity="0.15"
      stroke="#2563EB"
      stroke-width="2"
    />
    <path
      d="M35 60 L45 45 L70 45 L80 60"
      stroke="#2563EB"
      stroke-width="2"
      fill="#2563EB"
      opacity="0.1"
    />
    <path d="M42 56 L48 48 L62 48 L68 56" fill="#60A5FA" opacity="0.4" />
    <circle cx="22" cy="70" r="4" fill="#FBBF24" opacity="0.8" />
    <circle cx="92" cy="70" r="4" fill="#FBBF24" opacity="0.8" />
    <circle cx="35" cy="97" r="10" fill="#1F2937" />
    <circle cx="35" cy="97" r="5" fill="#9CA3AF" />
    <circle cx="75" cy="97" r="10" fill="#1F2937" />
    <circle cx="75" cy="97" r="5" fill="#9CA3AF" />
    <path
      d="M85 65 L100 50"
      stroke="#16A34A"
      stroke-width="3"
      stroke-linecap="round"
    />
    <rect x="95" y="45" width="10" height="12" rx="2" fill="#16A34A" />
    <path
      d="M100 48 L96 55 L102 53 L98 60"
      stroke="#FBBF24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) =>
      ["solar", "grid", "bess", "factory", "ev"].includes(value),
  },
});
</script>
