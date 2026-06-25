<template>
  <div
    class="min-h-screen flex flex-col transition-colors duration-300 bg-white text-gray-900"
  >
    <Navbar />
    <main class="flex-grow pt-[70px] lg:pt-[110px]">
      <div class="container mx-auto px-4 max-w-[1280px]">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>
