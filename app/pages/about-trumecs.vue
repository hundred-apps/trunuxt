<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto max-w-4xl px-4">
      <!-- Title -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Tentang Trumecs
        </h1>
        <p class="text-lg text-gray-600">
          Temukan Kepraktisan Belanja Produk Mekanikal Bersama Kami
        </p>
      </div>

      <!-- Hero -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <p class="text-gray-700 leading-relaxed mb-6">
          TRUMECS, platform milik PT. Tiyasa Makmur Perkasa, menyediakan produk dan komponen mekanikal berkualitas tinggi dengan harga kompetitif. Kami mempermudah belanja dengan layanan pengiriman yang efisien, memberikan solusi terpercaya bagi industri dan stakeholder untuk mendapatkan produk yang bermutu dan keamanan dalam bertransaksi.
        </p>
        <div class="flex flex-wrap gap-4">
          <Trulink to="/article" class="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">
            Baca Artikel
          </Trulink>
          <a
            :href="principalWhatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="px-6 py-3 bg-white text-orange-500 border border-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Menjadi Principal
          </a>
        </div>
      </div>

      <!-- Why Trumecs -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          KENAPA HARUS TRUMECS ?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Aman</h3>
            <p class="text-sm text-gray-600">Kami menciptakan lingkungan yang aman dan terpercaya dari penawaran hingga after sales, kami jamin keamanan anda</p>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Valid</h3>
            <p class="text-sm text-gray-600">Kami menerapkan validasi dan verifikasi yang ketat pada jaringan pembeli dan penjual kami, untuk menjamin interaksi yang terpercaya.</p>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Transparent</h3>
            <p class="text-sm text-gray-600">Trumecs mewujudkan transparansi dalam setiap transaksi, dengan menyajikan seluruh informasi terkai produk dan proses secara jelas dan terperinci.</p>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Beberapa layanan yang kami berikan untuk anda
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Jual Alat Mechanical dan pasarkan produk anda</h3>
            <p class="text-gray-600 mb-2">Bergabunglah dengan komunitas kami di platform ini untuk memperluas jangkauan pasar dan meningkatkan penjualan produk mekanikal Anda.</p>
            <Trulink to="/principal/form" class="text-orange-500 hover:underline text-sm font-medium">Baca Lebih Detail</Trulink>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Menjadi Penyedia Alat Untuk Rental</h3>
            <p class="text-gray-600 mb-2">Dapatkan eksposur yang lebih luas dan peningkatan sewa dengan memasarkan alat mekanikal Anda di platform kami kepada ribuan pelanggan yang membutuhkan solusi sewa terpercaya.</p>
            <Trulink to="/principal/form" class="text-orange-500 hover:underline text-sm font-medium">Baca Lebih Detail</Trulink>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Menjadi Penyedia Jasa Mekanikal di Trumecs</h3>
            <p class="text-gray-600 mb-2">Tingkatkan visibilitas dan kredibilitas layanan jasa mekanikal Anda dengan bergabung di platform kami yang menyediakan akses kepada pelanggan yang mencari solusi teknis terbaik.</p>
            <Trulink to="/principal/form" class="text-orange-500 hover:underline text-sm font-medium">Baca Lebih Detail</Trulink>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-orange-500 rounded-2xl p-6 text-center text-white">
          <p class="text-3xl font-bold">20,000+</p>
          <p class="text-sm font-medium">User Mechanical</p>
        </div>
        <div class="bg-orange-500 rounded-2xl p-6 text-center text-white">
          <p class="text-3xl font-bold">200+</p>
          <p class="text-sm font-medium">Transaksi Mechanical</p>
        </div>
        <div class="bg-orange-500 rounded-2xl p-6 text-center text-white">
          <p class="text-3xl font-bold">40+</p>
          <p class="text-sm font-medium">Brand Sudah Bergabung</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <p class="text-lg text-gray-700 mb-4">Perluas bisnis anda sekarang!</p>
        <a
          :href="principalWhatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          Bergabung Sekarang
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Tentang Trumecs",
  titleTemplate: "%s | Trumecs.com",
  meta: [
    { name: "description", content: "TRUMECS, platform milik PT. Tiyasa Makmur Perkasa, menyediakan produk dan komponen mekanikal berkualitas tinggi dengan harga kompetitif." },
  ],
});

const principalWhatsappLink = computed(() => {
  const message =
    "Halo Trumecs, saya tertarik menjadi principal dan ingin bergabung. Bisakah Trumecs membantu saya?";
  return `https://wa.me/6285176912338?text=${encodeURIComponent(message)}`;
});
</script>
