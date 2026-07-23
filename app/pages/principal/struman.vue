<template>
  <div class="min-h-screen bg-white">
    <!-- ============ HERO SECTION ============ -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div class="absolute inset-0 opacity-5">
        <div class="industrial-grid-bg w-full h-full"></div>
      </div>

      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10"
      >
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-4 sm:space-y-6">
            <div
              class="inline-flex items-center gap-2 bg-white/10 text-orange-400 px-3 py-1 rounded-full border border-white/10 text-xs font-medium tracking-wider uppercase"
            >
              <img
                src="https://migration.trumecs.com/logo/principal/struman.png"
                alt="STRUMAN Brand"
                class="relative w-full h-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
              <span class="material-symbols-outlined text-[16px]"
                >electric_bolt</span
              >
              Industrial Excellence
            </div>

            <h1
              class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              STRUMAN<br />
              <span class="text-orange-400">Power Solutions</span>
            </h1>

            <p
              class="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed"
            >
              Keandalan tanpa kompromi untuk garda terdepan industri. Pembangkit
              listrik portabel dan panel surya presisi untuk operasi kritis.
            </p>

            <div class="flex flex-wrap gap-3 pt-2">
              <a
                href="#catalog"
                class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                Lihat Catalog
                <span class="material-symbols-outlined text-[18px]"
                  >arrow_forward</span
                >
              </a>
            </div>
          </div>

          <!-- Right Image -->
          <div class="hidden lg:flex justify-center items-center">
            <div class="relative w-full max-w-md aspect-square">
              <div
                class="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-2xl blur-2xl"
              ></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYtbwvjEVouSodgfvb3G0IaMByPxJ_yw6CPLEsacICAfNxvjy6PNlRr6jzyU3ue7MG2s25bUJGjTELjiYIL-34QZdY5yD-6c9AiJ1ujKN2MEjlAlIx0CRUKn1x0H7PYLJsbIPZLRq_SvJAybrq6BSMCUmgVnxvsa1yy4vy6AGWO6iXRRwZHNIVS6Ma-cds14e8kpWZqu9x5H3gcTsinIrAPftbnP_QTHx-BLynNmygwqrvgjogxoLpGUb1TTUK0qtRo0z-rhAeAN9L"
                alt="STRUMAN G24 PRO"
                class="relative w-full h-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ BRAND INTRO ============ -->
    <section class="py-10 sm:py-14 border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3"
        >
          Integrated Power Architecture
        </h2>
        <p
          class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto"
        >
          Ekosistem eksklusif dari baterai lithium fosfat berdensitas tinggi
          hingga BMS cerdas. Sistem kami bekerja bersama untuk daya tanpa henti
          di lokasi terpencil, unit medis, dan zona pemulihan bencana.
        </p>
      </div>
    </section>

    <!-- ============ USE CASES ============ -->
    <section class="py-10 sm:py-14 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-10">
          <span
            class="inline-block text-orange-500 font-semibold text-xs tracking-wider uppercase mb-2"
            >Use Cases</span
          >
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            STRUMAN Bisa Digunakan Di Mana Saja
          </h2>
          <p class="text-sm text-gray-600 max-w-xl mx-auto mt-2">
            Dari hunian rumah hingga operasi industri berat — solusi energi
            mandiri yang andal.
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <div
            v-for="useCase in useCases"
            :key="useCase.title"
            class="group relative rounded-xl overflow-hidden bg-gray-900 aspect-[4/3] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <img
              :src="useCase.image"
              :alt="useCase.title"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            ></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <h3 class="text-white font-bold text-base sm:text-lg">
                {{ useCase.title }}
              </h3>
              <p class="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">
                {{ useCase.description }}
              </p>
              <span
                class="inline-block mt-2 text-orange-400 text-xs font-medium"
                >{{ useCase.recommendation }}</span
              >
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div
          class="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-900 rounded-xl p-4 sm:p-6"
        >
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-orange-400 font-bold text-lg sm:text-xl">
              {{ stat.value }}
            </p>
            <p class="text-gray-400 text-xs sm:text-sm">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ PRODUCT CATALOG ============ -->
    <section class="py-10 sm:py-14" id="catalog">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6 sm:mb-8">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Katalog Produk
          </h2>
          <span class="text-sm text-gray-500"
            >{{ products.length }} produk</span
          >
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div
              class="aspect-square bg-gray-50 flex items-center justify-center p-4"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div class="p-4 sm:p-5">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-bold text-gray-900 text-sm sm:text-base">
                  {{ product.name }}
                </h3>
                <span
                  :class="`${product.badgeColor} text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap`"
                >
                  {{ product.badge }}
                </span>
              </div>

              <p class="text-orange-500 font-bold text-base sm:text-lg mt-1">
                {{ product.price }}
              </p>

              <div class="mt-3 space-y-1 text-xs sm:text-sm">
                <div
                  v-for="spec in product.specs.slice(0, 3)"
                  :key="spec.label"
                  class="flex justify-between border-b border-gray-50 py-1.5 last:border-0"
                >
                  <span class="text-gray-500">{{ spec.label }}</span>
                  <span class="text-gray-700 font-medium">{{
                    spec.value
                  }}</span>
                </div>
              </div>

              <button
                @click="openModal(product.id)"
                class="w-full mt-4 py-2 text-sm font-semibold text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer class="bg-gray-900 text-gray-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span class="text-xl font-bold text-white">TRUMECS</span>
            <p class="text-sm text-gray-400 mt-2 max-w-xs">
              Marketplace Alat Berat Industri dan Solusi Daya Presisi.
            </p>
            <div class="flex gap-3 mt-4">
              <span
                v-for="icon in ['face_nod', 'hub', 'mail']"
                :key="icon"
                class="material-symbols-outlined text-gray-400 hover:text-white cursor-pointer transition-colors text-xl"
              >
                {{ icon }}
              </span>
            </div>
          </div>

          <div v-for="section in footerSections" :key="section.title">
            <h4 class="text-white font-semibold text-sm mb-3">
              {{ section.title }}
            </h4>
            <ul class="space-y-2 text-sm">
              <li v-for="link in section.links" :key="link.text">
                <a
                  :href="link.href"
                  class="text-gray-400 hover:text-white transition-colors"
                  >{{ link.text }}</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Buletin</h4>
            <p class="text-sm text-gray-400">
              Update teknologi industri terbaru.
            </p>
            <div class="flex mt-3">
              <input
                type="email"
                placeholder="Email"
                class="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg text-sm font-semibold transition-colors"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500"
        >
          <p>© 2024 TRUMECS Solusi Daya Industri. Hak cipta dilindungi.</p>
          <span>STRUMAN Daftar Harga 260622</span>
        </div>
      </div>
    </footer>

    <!-- ============ PRODUCT MODAL ============ -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10"
          >
            <div class="flex items-center gap-2">
              <span
                :class="`${selectedProduct?.badgeColor} text-[10px] px-2 py-0.5 rounded font-medium`"
              >
                {{ selectedProduct?.badge }}
              </span>
              <span class="text-gray-400 text-xs">{{
                selectedProduct?.sku
              }}</span>
            </div>
            <button
              @click="closeModal"
              class="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span class="material-symbols-outlined text-gray-500">close</span>
            </button>
          </div>

          <div v-if="selectedProduct" class="p-5">
            <!-- Image -->
            <div
              class="bg-gray-50 rounded-xl flex items-center justify-center aspect-square mb-4"
            >
              <img
                :src="selectedProduct.images[0]"
                :alt="selectedProduct.name"
                class="max-h-full max-w-full object-contain"
              />
            </div>

            <!-- Info -->
            <h2 class="text-xl font-bold text-gray-900">
              {{ selectedProduct.name }}
            </h2>
            <p class="text-gray-500 text-sm">{{ selectedProduct.subtitle }}</p>
            <p class="text-orange-500 font-bold text-2xl mt-2">
              {{ selectedProduct.price }}
            </p>

            <!-- Specs -->
            <h4 class="font-semibold text-sm text-gray-700 mt-4 mb-2">
              Spesifikasi
            </h4>
            <div class="space-y-1 text-sm">
              <div
                v-for="spec in selectedProduct.specs"
                :key="spec.label"
                class="flex justify-between border-b border-gray-50 py-2"
              >
                <span class="text-gray-500">{{ spec.label }}</span>
                <span class="text-gray-800 font-medium">{{ spec.value }}</span>
              </div>
            </div>

            <!-- Capabilities -->
            <h4 class="font-semibold text-sm text-gray-700 mt-4 mb-2">
              Fitur Unggulan
            </h4>
            <div class="space-y-3">
              <div
                v-for="cap in selectedProduct.capabilities"
                :key="cap.title"
                class="flex gap-3"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"
                >
                  <span
                    class="material-symbols-outlined text-orange-500 text-[18px]"
                    >{{ cap.icon }}</span
                  >
                </div>
                <div>
                  <p class="font-semibold text-sm text-gray-800">
                    {{ cap.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ cap.desc }}</p>
                </div>
              </div>
            </div>

            <button
              class="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-[18px]">chat</span>
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// ============ DATA ============
const useCases = [
  {
    image: "https://migration.trumecs.com/principal/struman/struman-10.png",
    title: "Rumah & Hunian",
    description:
      "Backup listrik saat PLN padam. Cocok diisi dari panel surya di atap.",
    recommendation: "Rekomendasi: HS1800 / G24 PRO",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-7.png",
    title: "Outdoor & Camping",
    description: "Portable dan mudah dibawa ke lokasi manapun tanpa akses PLN.",
    recommendation: "Rekomendasi: HS1800 / HS3600",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-5.png",
    title: "Kantor & Komersial",
    description:
      "Backup daya untuk operasional kantor yang tidak boleh terhenti.",
    recommendation: "Rekomendasi: G24 PRO / M50",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-8.png",
    title: "Medis & Klinik",
    description: "Pure Sine Wave output menjaga peralatan medis sensitif.",
    recommendation: "Rekomendasi: M50 / HS3600",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-9.png",
    title: "Konstruksi & Lapangan",
    description: "Pengganti genset berbahan bakar yang berisik dan berbau.",
    recommendation: "Rekomendasi: M50",
  },
  {
    image: "https://migration.trumecs.com/principal/struman/struman-1.png",
    title: "Sistem Energi Surya",
    description:
      "Dukung kapasitas G24 PRO + BT30 hingga 17,4 kWh untuk kemandirian energi.",
    recommendation: "Rekomendasi: G24 PRO + BT30",
  },
];

const stats = [
  { value: "3000+", label: "Siklus Pemakaian" },
  { value: "17,4 kWh", label: "Kapasitas Maksimum" },
  { value: "4500 W", label: "Daya Output Tertinggi" },
  { value: "Pure Sine Wave", label: "Aman Semua Perangkat" },
];

const products = [
  {
    id: "g24pro",
    name: "G24 PRO",
    badge: "BATERAI",
    badgeColor: "bg-green-100 text-green-700",
    price: "Rp22.800.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdMXXnrijX3G0qXiahle9Bul4aWebuSurj_yvFDzu7en_1drDS_xFZM5LyfkpEIAcK1pfBakn2fuZEdAftW2UwDBEJl5EvX-_iHc5yobce6JF1ab3YL9Fa2cLUByBo1oeeF1f_nuQuFbGAP_rL1-SeUgFNdZaUoeHaj9aCq_uSAGPyyj4vHrOeesckN3Mr60OrCpQ3JzNd6UFKagWdDdQ9tTfmQBC3jBwe01W3c5J5Qjb5wLMre4T27lrq6pxr6uuyXrIIKBC-ENe8",
    specs: [
      { label: "Kapasitas", value: "2048 Wh" },
      { label: "Daya Keluar", value: "3000 W" },
      { label: "Berat", value: "25 kg" },
    ],
  },
  {
    id: "bt30",
    name: "BT30",
    badge: "BATERAI",
    badgeColor: "bg-green-100 text-green-700",
    price: "Rp17.100.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLKqDPoe-C1QtqH08SYNLXMN0_xpC87LarEIyJoDt28Nknm8hnSVk0ScqFf__Uu2gdkbChDQSENYuiPb64cAfE5-zqDSz4-cb9pzJa_17sZjKYSzGABGIfGgb3q1E2XSxZACf5ZMj1Kflif-fC5wTL12XlDso6b9wyGvQ036Fsj1R9Kgd-WYGOhe11LWxMiTdQBuWdITor_p5HdTLMEVs_lObkk9jvdQiuNnfzHSeW2YRjPhu-9zG9q0b-alYjTFBBa4WGJKYsyWzi",
    specs: [
      { label: "Kapasitas", value: "3072 Wh" },
      { label: "Berat", value: "25 kg" },
      { label: "Kompatibel", value: "G24 PRO" },
    ],
  },
  {
    id: "hs1800",
    name: "HS1800",
    badge: "BATERAI",
    badgeColor: "bg-green-100 text-green-700",
    price: "Rp13.100.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAipdGwPN58YGbA_994fWGfh1ptAj_PRSzaRmq3HhCJ188SZk-8oDgX2ucs_U6isvY5RNIyBHtkoGsL8YBDTqCkuZn6H7eM-hldLnmeo5if7AuN5Nzt_Je-gmSjGV3v7KzoIzOucukwErgUECIQDW5coNAZePFD9ZBFvS9HAK2tXrq4El1up34u9gcHsuWISRg04tDZgkH02G6COXnaP70IVrjvBtL6dyxSQBdvGLdN0ApajBi8Z6zpBaTavfHe20siLWoK61e7PEBt",
    specs: [
      { label: "Kapasitas", value: "1536 Wh" },
      { label: "Daya Keluar", value: "1800 W" },
      { label: "Berat", value: "16 kg" },
    ],
  },
  {
    id: "hs3600",
    name: "HS3600",
    badge: "BATERAI",
    badgeColor: "bg-green-100 text-green-700",
    price: "Rp30.300.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmcGIdKkuT4Pa9IPEFclz1ogDDW1dxtmoddjcpBpK7_eOF6gmt28LvjpzMzuTeirsr1_HSjpbEgZveuhna8ZWaEp3DzAY4eu6RLk3KtYXyP7wJFXVJqbGFcIy7hhn9KSg6kRB9mkTvMqQZRHIanFna6-t1Et1Kdh_da3I0PNQduJhF70rzZwzSHH4m9SulQLmDcOK4Ers5WpfWVXkcRiD4AkdgfzjM5AbwlBIwpbT-f25qagnX3gH-Ou4mHB2LINTyJLS8DdEfysHt",
    specs: [
      { label: "Kapasitas", value: "3072 Wh" },
      { label: "Daya Keluar", value: "3600 W" },
      { label: "Berat", value: "37 kg" },
    ],
  },
  {
    id: "m50",
    name: "M50",
    badge: "BATERAI",
    badgeColor: "bg-green-100 text-green-700",
    price: "Rp35.600.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMWDF3qg2xN-1Bw6jBPANVoMLKDVGNfXCtsN8zCPSfAUUS0UWr5AP_J6KxDBe2d5-_EdVEIui-cI6mYFyBJ6yohBHD6PzrzwdaW8R73Ir-h7zigmGAMg5LkCR9j_107g2rF5in4ny14TFg94jYOK5ZLBAkVaOOzE1SoFSbCf3Q3iD8JjMHhP1E0RhdDoDBn2zP6IYrz0rL_a1bkVuFBEd-MEuTDNYAg-HB0YKdIK4KpJdSytRBJ3tvoJclP4kN_KMZTNFofMXSYGm0",
    specs: [
      { label: "Kapasitas", value: "5120 Wh" },
      { label: "Daya Keluar", value: "4500 W" },
      { label: "Berat", value: "64 kg" },
    ],
  },
  {
    id: "ssp400",
    name: "SSP400",
    badge: "SOLAR",
    badgeColor: "bg-blue-100 text-blue-700",
    price: "Rp5.100.000",
    image: "https://migration.trumecs.com/principal/struman/SSP400.png",
    specs: [
      { label: "Kapasitas", value: "400 W" },
      { label: "Jumlah", value: "4 × 100 W" },
      { label: "Berat", value: "20 kg" },
    ],
  },
  {
    id: "ssp800",
    name: "SSP800",
    badge: "SOLAR",
    badgeColor: "bg-blue-100 text-blue-700",
    price: "Rp8.700.000",
    image: "https://migration.trumecs.com/principal/struman/SSP400.png",
    specs: [
      { label: "Kapasitas", value: "800 W" },
      { label: "Jumlah", value: "8 × 100 W" },
      { label: "Berat", value: "40 kg" },
    ],
  },
];

const productDetails: Record<string, any> = {
  g24pro: {
    name: "STRUMAN G24 PRO",
    subtitle: "Stasiun Daya yang Dapat Diperluas",
    price: "Rp22.800.000",
    badge: "BATERAI",
    badgeColor: "bg-green-100 text-green-700",
    sku: "SKU: STR-G24PRO",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdMXXnrijX3G0qXiahle9Bul4aWebuSurj_yvFDzu7en_1drDS_xFZM5LyfkpEIAcK1pfBakn2fuZEdAftW2UwDBEJl5EvX-_iHc5yobce6JF1ab3YL9Fa2cLUByBo1oeeF1f_nuQuFbGAP_rL1-SeUgFNdZaUoeHaj9aCq_uSAGPyyj4vHrOeesckN3Mr60OrCpQ3JzNd6UFKagWdDdQ9tTfmQBC3jBwe01W3c5J5Qjb5wLMre4T27lrq6pxr6uuyXrIIKBC-ENe8",
    ],
    specs: [
      { label: "Kapasitas", value: "2048 Wh" },
      { label: "Maks. Output", value: "3000 W" },
      { label: "Berat", value: "25 kg" },
      { label: "Baterai", value: "LiFePO4 (LFP)" },
      { label: "Input AC", value: "220-240 V~" },
      { label: "Dimensi", value: "51 × 35 × 55 cm" },
    ],
    capabilities: [
      {
        icon: "view_in_ar",
        title: "Desain Modular",
        desc: "Mudah dipasang, diperluas, dan dipindahkan.",
      },
      {
        icon: "bolt",
        title: "Pengisian Cepat",
        desc: "0-100% penuh dalam sekitar 2 jam.",
      },
      {
        icon: "eco",
        title: "Teknologi LiFePO4",
        desc: "Masa pakai lebih dari 3000 siklus.",
      },
    ],
  },
  // ... tambahkan produk detail lainnya sesuai kebutuhan
};

const footerSections = [
  {
    title: "Sumber Daya",
    links: [
      { text: "Pusat Bantuan", href: "#" },
      { text: "Informasi Garansi", href: "#" },
      { text: "Panduan Perawatan", href: "#" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { text: "Kebijakan Privasi", href: "#" },
      { text: "Syarat & Ketentuan", href: "#" },
      { text: "Logistik Global", href: "#" },
    ],
  },
];

// ============ STATE ============
const modalOpen = ref(false);
const modalImageIndex = ref(0);
const selectedProductId = ref<string | null>(null);

const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null;
  return productDetails[selectedProductId.value] || null;
});

const openModal = (productId: string) => {
  selectedProductId.value = productId;
  modalImageIndex.value = 0;
  modalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modalOpen.value = false;
  document.body.style.overflow = "";
};

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

useHead({
  title: "STRUMAN | Solusi Daya Industri - TRUMECS",
  meta: [
    {
      name: "description",
      content:
        "Keandalan tanpa kompromi untuk garda terdepan industri. Pembangkit listrik portabel dan panel surya presisi.",
    },
  ],
});
</script>

<style scoped>
.industrial-grid-bg {
  background-image: radial-gradient(#ffffff 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animasi hover halus */
.group:hover {
  transform: translateY(-2px);
}

/* Scrollbar kustom */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
