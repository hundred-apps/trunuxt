<template>
  <div class="min-h-screen bg-background font-body-md text-on-surface">
    <!-- 1. Hero Section -->
    <section
      class="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <div
          class="bg-cover bg-center w-full h-full"
          :style="{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuARdKjmt1GsJqLX36SI3POXwA2GT6XW60m0U_y73R4f3ofMEgWPUaBAgKYQ6iuAgW7WdnlOiseqWHy9dfmrmR75n42eXXW87-zBpJT3zGZ5G9OZJX3CvIyXNWE2qCokbR0LV_unkm-8JYD1UXnih8WN_fJw5ZMCqhjhkE-Co4PifaVKVaOOt8vGSSFAYtpCmBQwR8RCbWwgm4YQaxcW_0Q1q9b1HBbwrX8FYax1rBmBhfvFhBa56O2X')`,
          }"
        ></div>

        <!-- Overlay Gelap -->
        <div class="absolute inset-0 bg-black/60"></div>

        <!-- Overlay Gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
        ></div>

        <!-- Overlay Bottom -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
        ></div>
      </div>

      <!-- Konten -->
      <div
        class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center md:text-left pt-20"
      >
        <div class="max-w-3xl mx-auto md:mx-0">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6"
          >
            <span
              class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"
            ></span>
            <span class="font-mono text-xs tracking-wider font-semibold"
              >ISO 9001:2015 CERTIFIED</span
            >
          </div>

          <h1
            class="font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            Precision Machining Solutions for
            <span class="text-orange-400">Industrial Excellence</span>
          </h1>

          <p
            class="text-lg md:text-xl text-gray-200/90 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed"
          >
            Delivering high-precision machining services with advanced
            technology, experienced engineers, and strict quality control to
            meet your complex industrial manufacturing needs.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start"
          >
            <ElButton
              type="primary"
              size="large"
              class="w-full sm:w-auto !bg-orange-500 !border-orange-500 hover:!bg-orange-600 !text-white !px-8 !py-4 !rounded-lg !font-semibold !shadow-lg hover:!shadow-xl transition-all"
              @click="scrollTo('contact')"
            >
              Request a Quote
              <Icon name="mdi:arrow-right" class="text-lg ml-1" />
            </ElButton>

            <ElButton
              size="large"
              class="w-full sm:w-auto !bg-white/10 !border-2 !border-white/40 hover:!bg-white/20 !text-white !px-8 !py-4 !rounded-lg !font-semibold !backdrop-blur-sm transition-all"
              @click="scrollTo('services')"
            >
              Explore Our Services
            </ElButton>
          </div>

          <!-- Trust Indicators -->
          <div
            class="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/10 justify-center md:justify-start"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:check-circle" class="text-green-400 text-xl" />
              <span class="text-sm text-white/80">Precision Guaranteed</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="mdi:clock-fast" class="text-green-400 text-xl" />
              <span class="text-sm text-white/80">Fast Turnaround</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="mdi:shield-check" class="text-green-400 text-xl" />
              <span class="text-sm text-white/80">Quality Certified</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block"
      >
        <a
          @click.prevent="scrollTo('about')"
          class="text-white/50 hover:text-white/80 transition-colors cursor-pointer flex flex-col items-center gap-1"
        >
          <span class="text-[10px] uppercase tracking-widest">Scroll</span>
          <Icon name="mdi:chevron-double-down" class="text-2xl" />
        </a>
      </div>
    </section>

    <!-- 2. About Section -->
    <section class="py-24 bg-surface relative overflow-hidden" id="about">
      <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-1 bg-orange-500"></span>
              <span
                class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
                >About Us</span
              >
            </div>

            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
            >
              About Our Machining Excellence
            </h2>

            <p class="text-gray-600 mb-8 leading-relaxed">
              With decades of experience in the precision manufacturing sector,
              Precision Core provides unparalleled CNC machining services. Our
              facility is equipped with the latest multi-axis machinery operated
              by highly skilled technicians dedicated to achieving exacting
              tolerances and flawless finishes.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="item in aboutItems"
                :key="item.title"
                class="flex items-start gap-4"
              >
                <div
                  class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"
                >
                  <Icon :name="item.icon" class="text-orange-500 text-2xl" />
                </div>
                <div>
                  <h4 class="font-semibold text-primary mb-1">
                    {{ item.title }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              class="absolute -inset-4 bg-gray-100 rounded-2xl transform rotate-3 z-0 opacity-50"
            ></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqRoCAqyU-Vv0JveUI0ickT1MrOJQFHcYtQrJZDGym22rCLAO7HI7GovKB9AIu2UEVQqx0CJqPX7uz87gqu3blDtBnX56FH3Kq0B5N9r2JdNzihBXIkZKNthLDmWcWxlBekkz2DO-zVlvbQzyi7OxPVuWGQQzjulaA_LPP6sfEXMsoI1Gs0eCg-_aD8PDun1NZdIIL-ppS6fwQg1CuxpJVoAfK5n9lN4HgCRWms5kAj1ILQOtP5BF5"
              alt="Machining Excellence"
              class="relative z-10 w-full h-auto rounded-xl shadow-lg object-cover border border-gray-200/30 aspect-[4/3]"
              loading="lazy"
            />
            <div
              class="absolute -bottom-6 -left-6 z-20 bg-white rounded-xl p-6 shadow-xl border border-gray-200/30 hidden md:block"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center"
                >
                  <Icon name="mdi:timeline" class="text-white text-3xl" />
                </div>
                <div>
                  <div class="font-bold text-2xl text-primary">25+</div>
                  <div class="text-xs text-gray-600 uppercase tracking-wider">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Services Section -->
    <section class="py-4 bg-gray-50" id="services">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-16 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 mb-2 justify-center">
            <span class="w-8 h-1 bg-orange-500"></span>
            <span
              class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
              >Our Core Offerings</span
            >
            <span class="w-8 h-1 bg-orange-500"></span>
          </div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            Our Machining Services
          </h2>
          <p class="text-gray-600">
            Comprehensive precision manufacturing solutions tailored to your
            specific project requirements, from rapid prototyping to high-volume
            production.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="service in services"
            :key="service.title"
            class="bg-white rounded-xl p-8 border border-gray-200/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gray-100 group-hover:bg-orange-500 transition-colors flex items-center justify-center mb-6"
            >
              <Icon
                :name="service.icon"
                class="text-orange-500 group-hover:text-white transition-colors text-3xl"
              />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">
              {{ service.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-6 flex-grow">
              {{ service.description }}
            </p>
            <a
              class="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              Learn More <Icon name="mdi:arrow-right" class="text-base" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Capabilities Section -->
    <section class="py-24 bg-surface" id="capabilities">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div
          class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-8 h-1 bg-orange-500"></span>
              <span
                class="text-xs text-orange-500 uppercase tracking-widest font-semibold"
                >Technical Strength</span
              >
            </div>
            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary max-w-xl"
            >
              Our Capabilities
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          <!-- Large Feature Card -->
          <div
            class="md:col-span-2 md:row-span-2 bg-primary rounded-xl p-10 relative overflow-hidden flex flex-col justify-end border border-orange-800"
          >
            <div class="absolute inset-0 z-0">
              <div
                class="bg-cover bg-center w-full h-full transition-opacity duration-500"
                :style="{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2mxeTWzgpO4JYptQ1ntwTzarbN-SGP7g5RHhglGwtgug1I-Cm-AhZ4Y06m_k1dnVzTORE8gfgAUtIWJxBq2N9hxtUO-yxX3FjCHhuYy6z64UU7Ay7LasYH7UCVS0Gsvw4ts-aQZeJ84uFKym5Zac3io99KNHKlWiXU4-rAC6Adh7_y6tS_L1JLPlxFWuq9j40TxKPjw_KHgN1mP4V6TEcmHPLVfeaNvRsqDyb8K5NLmtGt40z858E')`,
                }"
              ></div>

              <!-- Overlay Gelap Solid -->
              <div class="absolute inset-0 bg-black/50"></div>

              <!-- Overlay Gradient dari Bawah -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
              ></div>

              <!-- Overlay Gradient Warna (Optional) -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"
              ></div>
            </div>

            <!-- Content -->
            <div class="relative z-10">
              <span
                class="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded mb-4"
              >
                Core Competency
              </span>
              <h3 class="text-3xl text-white font-bold mb-3">
                High Precision Manufacturing
              </h3>
              <p class="text-gray-200 max-w-md">
                Consistently delivering components with tolerances as tight as
                ±0.0001 inches, ensuring perfect fit and function for critical
                aerospace and medical applications.
              </p>
            </div>
          </div>

          <!-- Standard Cards -->
          <div
            v-for="cap in capabilities"
            :key="cap.title"
            class="bg-white rounded-xl p-8 border border-gray-200/30 shadow-sm flex flex-col justify-between hover:border-orange-500/30 transition-colors"
          >
            <Icon :name="cap.icon" class="text-orange-500 text-3xl" />
            <div>
              <h3 class="text-lg font-bold text-primary mb-2">
                {{ cap.title }}
              </h3>
              <p class="text-sm text-gray-600">{{ cap.description }}</p>
            </div>
          </div>

          <div
            class="md:col-span-2 bbg-white rounded-xl p-8 border border-gray-200/30 shadow-sm flex flex-col justify-between hover:border-orange-500/30 transition-colors"
          >
            <Icon
              name="material-symbols:straighten"
              class="text-orange-500 text-3xl"
            />
            <div>
              <h3 class="text-xl font-bold text-primary mb-2">
                Tight Tolerance Machining
              </h3>
              <p class="text-sm text-gray-600">
                Specialized processes and environmental controls for
                micro-machining requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Materials Section -->
    <section class="py-4 bg-gray-50 border-t border-gray-200/20" id="materials">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            Materials We Machine
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We have expertise in machining a vast array of materials, from
            common metals to exotic alloys and advanced engineering plastics.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div
            v-for="material in materials"
            :key="material.name"
            class="bg-white p-6 rounded-xl border border-gray-200/30 flex flex-col items-center text-center hover:bg-gray-50 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4"
            >
              <Icon :name="material.icon" class="text-orange-500 text-2xl" />
            </div>
            <span class="text-xs text-primary uppercase font-semibold">{{
              material.name
            }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Process Timeline -->
    <section class="py-12 bg-primary overflow-hidden relative">
      <div class="absolute inset-0 opacity-10 tech-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div class="mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Manufacturing Process
          </h2>
          <p class="text-gray-600 max-w-2xl">
            A rigorous, systematic approach to every project ensures quality,
            precision, and on-time delivery.
          </p>
        </div>

        <div class="relative">
          <div
            class="absolute top-1/2 left-0 w-full h-0.5 bg-orange-800 -translate-y-1/2 hidden md:block z-0"
          ></div>
          <div
            class="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative z-10"
          >
            <div
              v-for="(step, index) in processSteps"
              :key="index"
              class="flex flex-col items-center text-center"
              :class="{ 'md:translate-y-8': index % 2 === 1 }"
            >
              <div
                class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xl mb-6 shadow-lg ring-4 ring-primary"
              >
                {{ index + 1 }}
              </div>
              <h4 class="font-semibold mb-2">{{ step.title }}</h4>
              <p class="text-xs text-gray-600">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 13. Contact Section -->
    <section class="py-24 bg-surface" id="contact">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div
          class="bg-gray-50 rounded-2xl shadow-lg border border-gray-200/30 overflow-hidden"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Form Side -->
            <div class="p-8 md:p-12 lg:p-16">
              <div class="mb-8">
                <h2 class="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Let's Discuss Your Project
                </h2>
                <p class="text-gray-600">
                  Submit your requirements or drawings for a prompt technical
                  review and quote.
                </p>
              </div>

              <ElForm :model="form" label-position="top" class="space-y-6">
                <ElRow :gutter="20">
                  <ElCol :span="12">
                    <ElFormItem label="First Name" prop="firstName">
                      <ElInput
                        v-model="form.firstName"
                        placeholder="John"
                        size="large"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="12">
                    <ElFormItem label="Last Name" prop="lastName">
                      <ElInput
                        v-model="form.lastName"
                        placeholder="Doe"
                        size="large"
                      />
                    </ElFormItem>
                  </ElCol>
                </ElRow>

                <ElFormItem label="Company Name" prop="company">
                  <ElInput
                    v-model="form.company"
                    placeholder="Acme Industries"
                    size="large"
                  />
                </ElFormItem>

                <ElFormItem label="Email Address" prop="email">
                  <ElInput
                    v-model="form.email"
                    placeholder="john@example.com"
                    size="large"
                  />
                </ElFormItem>

                <ElFormItem label="Project Details" prop="details">
                  <ElInput
                    v-model="form.details"
                    type="textarea"
                    :rows="4"
                    placeholder="Briefly describe your machining needs..."
                    size="large"
                  />
                </ElFormItem>

                <ElButton
                  type="primary"
                  size="large"
                  class="!w-full !bg-orange-500 !border-orange-500 hover:!bg-orange-600 !text-white !py-4 !rounded-lg !font-semibold"
                  @click="handleSubmit"
                >
                  Submit Request
                  <Icon name="mdi:send" class="text-lg" />
                </ElButton>
              </ElForm>
            </div>

            <!-- Info Side -->
            <div
              class="bg-orange-500 p-8 md:p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between"
            >
              <div class="absolute inset-0 opacity-10 tech-pattern"></div>
              <div class="relative z-10 mb-12">
                <h3 class="text-2xl font-bold mb-8">Contact Information</h3>
                <div class="space-y-6">
                  <div
                    v-for="contact in contactInfo"
                    :key="contact.label"
                    class="flex items-start gap-4"
                  >
                    <Icon
                      :name="contact.icon"
                      class="text-orange-200 text-2xl mt-1"
                    />
                    <div>
                      <div
                        class="text-xs text-orange-200 uppercase tracking-wider mb-1"
                      >
                        {{ contact.label }}
                      </div>
                      <p class="text-white">{{ contact.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Map Placeholder -->
              <div
                class="relative z-10 w-full h-48 bg-gray-700 rounded-xl overflow-hidden border border-white/10"
              >
                <div
                  class="bg-cover bg-center w-full h-full opacity-80"
                  :style="{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB88-UYzzaN8ZD9VknDQnXhuIdSDhUd8B6rsERgKEU6OlkJdRtkwP4fU9kdU6QtHkDxdYr6wu9LJLDUl0jTya4qpV3l2pIh2zMx92Lkb62k8upFndw1M5XhIJnCVuIxq9hdQhWFLLJSWFxC4bjkTYPlckRLmW4NltcWAi7-noOWZhHbP-Zq5N6oywcquiKjAO6ej5ernqF_HwqwAPcO3r-bKz5lxqlFuDWIJl2hmbjn2vrHjL6UaZjr')`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

// ============ DATA ============
const aboutItems = [
  {
    icon: "mdi:architecture",
    title: "Precision Engineering",
    description: 'Tolerances down to ±0.0001" for critical applications.',
  },
  {
    icon: "mdi:memory",
    title: "Advanced CNC Tech",
    description: "State-of-the-art 5-axis milling and turning centers.",
  },
  {
    icon: "garden:adjust-stroke-12",
    title: "Experienced Machinists",
    description: "Decades of combined expertise in complex geometries.",
  },
  {
    icon: "mdi:verified",
    title: "Quality Assurance",
    description: "Rigorous CMM inspection and documentation.",
  },
];

const services = [
  {
    icon: "ix:applications",
    title: "CNC Milling",
    description:
      "High-precision 3, 4, and 5-axis milling for complex geometries and intricate features in various materials.",
  },
  {
    icon: "mdi:sync",
    title: "CNC Turning",
    description:
      "Advanced lathe operations with live tooling for cylindrical components requiring exact concentricity.",
  },
  {
    icon: "mdi:blur-on",
    title: "Surface Grinding",
    description:
      "Achieving ultra-fine surface finishes and extreme flatness tolerances for critical mating surfaces.",
  },
  {
    icon: "mdi:build",
    title: "Conventional Machining",
    description:
      "Manual machining capabilities for simple secondary operations, tooling, and specialized repairs.",
  },
];

const capabilities = [
  {
    icon: "catppuccin:docker-ignore",
    title: "Small to Large Batch",
    description:
      "Flexible production scaling from single prototypes to tens of thousands of units.",
  },
  {
    icon: "streamline-ultimate:science-molecule",
    title: "Prototype Development",
    description:
      "Rapid turnaround for R&D phases, helping you bring products to market faster.",
  },
  {
    icon: "carbon:ibm-cloud-essential-security-and-observability-services",
    title: "Custom Design Support",
    description:
      "DFM (Design for Manufacturability) consulting to optimize your designs for production.",
  },
];

const materials = [
  { name: "Carbon Steel", icon: "mdi:layers" },
  { name: "Stainless Steel", icon: "game-icons:steel-claws" },
  { name: "Aluminum", icon: "mdi:fitness-center" },
  { name: "Brass & Copper", icon: "mdi:architecture" },
];

const processSteps = [
  { title: "Consultation", description: "Project scope & requirements" },
  { title: "Engineering", description: "CAD/CAM & DFM review" },
  { title: "Materials", description: "Sourcing & verification" },
  { title: "Machining", description: "Precision CNC operations" },
  { title: "Inspection", description: "CMM & visual quality check" },
  { title: "Delivery", description: "Secure packaging & logistics" },
];

const contactInfo = [
  {
    icon: "mdi:map-marker",
    label: "Facility Address",
    value:
      "No. B, Jl. Pintu Air Raya No.31, RT.13/RW.8, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10710",
  },
  { icon: "mdi:phone", label: "Phone & WhatsApp", value: "+626285176912338" },
  { icon: "mdi:email", label: "Email", value: "info@trumecs.com" },
];

// ============ FORM ============
const form = reactive({
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  details: "",
});

// ============ METHODS ============
const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleSubmit = () => {
  ElMessage.success(
    "Your request has been submitted! We will contact you shortly."
  );
  Object.assign(form, {
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    details: "",
  });
};

// ============ SEO ============
useHead({
  title: "Precision Core - Precision Machining Solutions",
  meta: [
    {
      name: "description",
      content:
        "Delivering high-precision machining services with advanced technology, experienced engineers, and strict quality control.",
    },
  ],
});
</script>

<style scoped>
.tech-pattern {
  background-image:
    radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 50%,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 50%
    );
}

/* Override Element Plus button styles */
:deep(.el-button) {
  font-weight: 600 !important;
}

:deep(.el-button.is-disabled) {
  opacity: 0.5;
}

/* Form styles */
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}

:deep(.el-form-item .el-form-item__label) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  padding-bottom: 4px !important;
}

:deep(.el-input__wrapper) {
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px #e5e7eb inset !important;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #fa8420 inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #fa8420 inset !important;
}

:deep(.el-textarea__inner) {
  border-radius: 8px !important;
  border-color: #e5e7eb !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #fa8420 !important;
  box-shadow: 0 0 0 2px rgba(250, 132, 32, 0.2) !important;
}
</style>
