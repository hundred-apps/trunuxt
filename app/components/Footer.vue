<template>
  <footer class="bg-black text-white mt-3">
    <!-- Promo Section untuk Guest User -->
    <div class="w-full">
      <div class="container-fluid max-w-[1500px] mx-auto">
        <div class="row p-3">
          <div class="col-lg-12 text-center">
            <p class="text-xl text-white">
              {{ $t("footer.expand") }}
              <Trulink to="#" class="el-button el-button--primary ml-2">
                {{ $t("button.joinNow") }}
              </Trulink>
            </p>
          </div>
        </div>
        <hr class="m-0 border-t border-gray-600" />
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="container-fluid max-w-[1500px] mx-auto px-2 py-0">
      <div class="row px-2 mx-0 py-0 flex flex-col lg:flex-row">
        <!-- Logo & Social Media -->
        <div class="lg:w-1/4 w-full p-3">
          <div
            class="logo mb-6"
            :class="{ 'flex justify-center lg:justify-start': true }"
          >
            <Trulink to="/">
              <img
                :src="footerLogo"
                alt="Logo Trumecs Footer"
                class="w-[200px]"
              />
            </Trulink>
          </div>
          <p
            class="font-bold mt-3 mb-3 text-lg"
            :class="{ 'text-center lg:text-left': true }"
          >
            {{ $t("footer.followUs") }}
          </p>
          <div
            class="flex gap-4"
            :class="{
              'justify-center lg:justify-start': true,
              'xs:hidden lg:flex': true, // Hide on extra small, show on large
            }"
          >
            <a
              v-for="social in socialMedia"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white hover:text-orange-500 transition-colors"
            >
              <Icon :name="social.icon" class="text-2xl" />
            </a>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="lg:w-1/4 w-full p-3 mt-3">
          <p class="font-bold text-lg mb-3">
            {{ $t("footer.contactUs") }}
          </p>
          <div class="contact-info mt-3 space-y-3">
            <div class="contact-item flex items-center">
              <div class="me-3">
                <Icon name="logos:whatsapp-icon" class="text-2xl" />
              </div>
              <div>
                <a
                  :href="`https://wa.me/${contactInfo.whatsapp}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-white hover:text-orange-500 transition-colors"
                >
                  <p class="text-base mb-0">
                    {{ contactInfo.whatsappDisplay }}
                  </p>
                </a>
              </div>
            </div>

            <div class="contact-item flex items-center">
              <div class="me-3">
                <Icon name="material-symbols:mail" class="text-2xl" />
              </div>
              <div>
                <a
                  :href="`mailto:${contactInfo.email}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-white hover:text-orange-500 transition-colors"
                >
                  <p class="text-base mb-0">
                    {{ contactInfo.email }}
                  </p>
                </a>
              </div>
            </div>

            <div class="contact-item flex items-start">
              <div class="me-3 mt-1">
                <Icon name="material-symbols:location-on" class="text-2xl" />
              </div>
              <div>
                <a
                  :href="contactInfo.mapUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-white hover:text-orange-500 transition-colors"
                >
                  <p class="text-base mb-0">
                    {{ contactInfo.address }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Learn & Subscribe Section -->
        <div class="lg:w-1/2 w-full p-3 mt-3">
          <p
            class="text-xl font-bold text-white"
            :class="{ 'text-left lg:text-end': true }"
          >
            {{ $t("footer.hesitant") }}
          </p>

          <div class="row mt-4 mb-4 py-0 flex flex-col lg:flex-row">
            <!-- Learn Section -->
            <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
              <div class="mb-3">
                <Icon name="material-symbols:menu-book" class="text-2xl" />
              </div>
              <p class="font-bold text-lg text-white mb-2">
                {{ $t("footer.teach.title") }}
              </p>
              <p class="mb-3">
                {{ $t("footer.teach.contentBefore") }}
                <Trulink to="/article">
                  {{ $t("footer.teach.content") }}
                </Trulink>
                {{ $t("footer.teach.contentAfter") }}
              </p>
              <Trulink to="/" class="el-button el-button--primary">
                {{ $t("button.readFirst") }}
              </Trulink>
            </div>

            <!-- Subscribe Section -->
            <div class="lg:w-1/2 w-full text-start lg:text-end">
              <form @submit.prevent="handleSubscribe" class="space-y-3">
                <div class="mb-3">
                  <Icon name="material-symbols:mail" class="text-2xl" />
                </div>
                <p class="font-bold text-lg text-white mb-2">
                  {{ $t("footer.info.title") }}
                </p>
                <p class="text-base text-white mb-3">
                  {{ $t("footer.info.content") }}
                </p>

                <div class="flex">
                  <el-input
                    v-model="subscribeEmail"
                    type="email"
                    :placeholder="$t('placeholder.inputYourEmail')"
                    class="flex-grow rounded-none"
                    required
                  />
                  <el-button
                    type="primary"
                    native-type="submit"
                    class="rounded-none font-bold bg-[#fa8420] hover:bg-[#e6761a] border-[#fa8420] hover:border-[#e6761a]"
                  >
                    {{ $t("button.send") }}
                  </el-button>
                </div>

                <el-alert
                  v-if="subscribeMessage"
                  :title="subscribeMessage"
                  :type="subscribeSuccess ? 'success' : 'error'"
                  show-icon
                  class="mt-2"
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="row mt-4 py-4 bg-black">
        <div class="col-lg-12 mt-4">
          <p class="text-center text-white">
            Trumecs.com © 2022 | Tiyasa Makmur Perkasa
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
const { $gtm } = useNuxtApp();

const subscribeEmail = ref("");
const subscribeMessage = ref("");
const subscribeSuccess = ref(false);

const isDark = computed(() => useColorMode().preference === "dark");
const footerLogo = computed(() =>
  isDark.value
    ? "https://migration.trumecs.com/logo/dark.png"
    : "https://migration.trumecs.com/logo/dark.png"
);
const socialMedia = [
  {
    name: "linkedin",
    icon: "mdi:linkedin",
    url: "https://www.linkedin.com/company/trumecs",
  },
  {
    name: "instagram",
    icon: "mdi:instagram",
    url: "https://www.instagram.com/trumecs",
  },
  {
    name: "facebook",
    icon: "mdi:facebook",
    url: "https://www.facebook.com/trumecsid",
  },
  { name: "twitter", icon: "mdi:twitter", url: "https://twitter.com/trumecs" },
  {
    name: "youtube",
    icon: "mdi:youtube",
    url: "https://www.youtube.com/@trumecs",
  },
];

// Contact Info
const contactInfo = {
  whatsapp: "+6285176912338",
  whatsappDisplay: "+62851-7691-2338",
  email: "info@trumecs.com",
  address:
    "No. B, Jl. Pintu Air Raya No.31, RT.13/RW.8, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10710",
  mapUrl: "https://maps.app.goo.gl/XF8berfSdGwtQ4qv9",
};

const { $gtmPush } = useNuxtApp();

function trackClick() {
  $gtmPush({
    event: "button_click",
    label: "register",
  });
}

// Methods
const handleSubscribe = async () => {
  if (!subscribeEmail.value) {
    subscribeMessage.value = "Email tidak boleh kosong";
    subscribeSuccess.value = false;
    return;
  }

  try {
    // Kirim email subscribe ke API
    const response = await $fetch("/api/subscribe", {
      method: "POST",
      body: { email: subscribeEmail.value },
    });

    if (response.success) {
      subscribeMessage.value = "Terima kasih telah berlangganan!";
      subscribeSuccess.value = true;
      subscribeEmail.value = "";

      // Reset message setelah 5 detik
      setTimeout(() => {
        subscribeMessage.value = "";
      }, 5000);
    }
  } catch (error) {
    subscribeMessage.value = "Gagal berlangganan. Silakan coba lagi.";
    subscribeSuccess.value = false;
  }
};
</script>

<style scoped>
.el-button--primary {
  --el-button-bg-color: #fa8420;
  --el-button-border-color: #fa8420;
  --el-button-hover-bg-color: #e6761a;
  --el-button-hover-border-color: #e6761a;
  --el-button-active-bg-color: #d16916;
  --el-button-active-border-color: #d16916;
}
</style>
