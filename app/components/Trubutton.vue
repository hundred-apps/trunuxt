<!-- components/BaseButton.vue -->
<script lang="ts" setup>
import { computed } from "vue";

// ============ PROPS ============
const props = defineProps({
  // Type
  type: {
    type: String as () =>
      | "primary"
      | "success"
      | "warning"
      | "danger"
      | "info"
      | "text",
    default: "primary",
  },
  // Size
  size: {
    type: String as () => "large" | "default" | "small" | "mini",
    default: "default",
  },
  // Variant (style)
  variant: {
    type: String as () => "solid" | "outline" | "ghost" | "light",
    default: "solid",
  },
  // Shape
  shape: {
    type: String as () => "default" | "round" | "circle" | "pill",
    default: "default",
  },
  // Icon
  icon: {
    type: String,
    default: "",
  },
  // Icon position
  iconPosition: {
    type: String as () => "left" | "right",
    default: "left",
  },
  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },
  // Disabled state
  disabled: {
    type: Boolean,
    default: false,
  },
  // Full width
  fullWidth: {
    type: Boolean,
    default: false,
  },
  // Text
  text: {
    type: String,
    default: "",
  },
  // El-Plus native props
  nativeType: {
    type: String as () => "button" | "submit" | "reset",
    default: "button",
  },
  // Custom classes
  customClass: {
    type: String,
    default: "",
  },
});

// ============ EMITS ============
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// ============ COMPUTED ============
// Color mapping berdasarkan type
const colorClasses = {
  primary: {
    solid:
      "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white border-transparent",
    outline:
      "border-orange-500 text-orange-500 hover:bg-orange-50 active:bg-orange-100",
    ghost: "text-orange-500 hover:bg-orange-50 active:bg-orange-100",
    light:
      "bg-orange-50 text-orange-600 hover:bg-orange-100 active:bg-orange-200",
  },
  success: {
    solid:
      "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white border-transparent",
    outline:
      "border-green-500 text-green-500 hover:bg-green-50 active:bg-green-100",
    ghost: "text-green-500 hover:bg-green-50 active:bg-green-100",
    light: "bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200",
  },
  warning: {
    solid:
      "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white border-transparent",
    outline:
      "border-yellow-500 text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100",
    ghost: "text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100",
    light:
      "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200",
  },
  danger: {
    solid:
      "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-transparent",
    outline: "border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100",
    ghost: "text-red-500 hover:bg-red-50 active:bg-red-100",
    light: "bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200",
  },
  info: {
    solid:
      "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white border-transparent",
    outline:
      "border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100",
    ghost: "text-blue-500 hover:bg-blue-50 active:bg-blue-100",
    light: "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200",
  },
  text: {
    solid:
      "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white border-transparent",
    outline:
      "border-gray-500 text-gray-500 hover:bg-gray-50 active:bg-gray-100",
    ghost: "text-gray-500 hover:bg-gray-50 active:bg-gray-100",
    light: "bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200",
  },
};

// Size mapping
const sizeClasses = {
  large: "px-6 py-3 text-base min-h-[48px]",
  default: "px-4 py-2 text-sm min-h-[40px]",
  small: "px-3 py-1.5 text-xs min-h-[32px]",
  mini: "px-2 py-1 text-xs min-h-[24px]",
};

// Shape mapping
const shapeClasses = {
  default: "rounded-lg",
  round: "rounded-xl",
  circle: "rounded-full aspect-square",
  pill: "rounded-full px-6",
};

// Ikon size
const iconSizeClasses = {
  large: "text-xl",
  default: "text-lg",
  small: "text-base",
  mini: "text-sm",
};

// Computed button classes
const buttonClass = computed(() => {
  const classes = [
    // Base
    "inline-flex items-center justify-center gap-2",
    "font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-95",

    // Width
    props.fullWidth ? "w-full" : "",

    // Size
    sizeClasses[props.size],

    // Shape
    props.shape === "circle"
      ? `w-${sizeClasses[props.size].match(/min-h-\[(\d+)px\]/)?.[1] || 40}px`
      : shapeClasses[props.shape],

    // Variant & Type
    colorClasses[props.type][props.variant],

    // Focus ring berdasarkan type
    `focus:ring-${props.type === "text" ? "gray" : props.type}-300`,

    // Custom class
    props.customClass,
  ];

  return classes.filter(Boolean).join(" ");
});

// Loading icon
const loadingIcon = computed(() => {
  return props.loading ? "mdi:loading" : props.icon;
});

// Compute button content
const buttonContent = computed(() => {
  return props.text || "";
});
</script>

<template>
  <button
    :type="nativeType"
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <Icon
      v-if="loading"
      name="mdi:loading"
      :class="['animate-spin', iconSizeClasses[size]]"
    />

    <!-- Left Icon -->
    <Icon
      v-else-if="icon && iconPosition === 'left'"
      :name="icon"
      :class="iconSizeClasses[size]"
    />

    <!-- Text / Slot -->
    <span v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </span>

    <!-- Right Icon -->
    <Icon
      v-if="icon && iconPosition === 'right' && !loading"
      :name="icon"
      :class="iconSizeClasses[size]"
    />
  </button>
</template>
