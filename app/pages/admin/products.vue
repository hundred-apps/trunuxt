<template>
  <div class="admin-products">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.products.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.products.subtitle") }}</p>
      </div>
      <div class="flex gap-3">
        <Trubutton
          :text="$t('admin.products.addNew')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
          @click="openCreate"
        />
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Filter Sidebar -->
      <aside class="lg:w-72 shrink-0">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:sticky lg:top-4">
          <form @submit.prevent="applyFilters" class="flex flex-col gap-3">
            <div>
              <el-input
                v-model="filters.keyword"
                :placeholder="$t('admin.products.searchPlaceholder')"
                class="w-full"
                prefix-icon="material-symbols:search"
                clearable
                @keyup.enter="applyFilters"
                @clear="applyFilters"
                @change="applyFilters"
              />
            </div>
            <el-select
              v-model="filters.category"
              :placeholder="$t('admin.table.category')"
              class="w-full"
              size="small"
              clearable
              filterable
              @change="applyFilters"
            >
              <el-option :label="$t('admin.filters.all')" value="" />
              <el-option
                v-for="cat in availableCategories"
                :key="cat.id"
                :label="cat.parent ? `${cat.parent} / ${cat.name}` : cat.name"
                :value="String(cat.id)"
              />
              <el-option
                :label="$t('admin.products.noCategory')"
                value="0"
              />
            </el-select>
            <el-select
              v-model="filters.brand"
              :placeholder="$t('admin.table.brand')"
              class="w-full"
              size="small"
              clearable
              filterable
              @change="applyFilters"
            >
              <el-option :label="$t('admin.filters.all')" value="" />
              <el-option
                v-for="brand in availableBrands"
                :key="brand"
                :label="brand"
                :value="brand"
              />
            </el-select>
            <el-select
              v-model="filters.status"
              :placeholder="$t('admin.filters.status')"
              class="w-full"
              size="small"
              clearable
              @change="applyFilters"
            >
              <el-option :label="$t('admin.filters.all')" value="" />
              <el-option
                v-for="status in availableStatuses"
                :key="status"
                :label="getStatusLabel(status)"
                :value="status"
              />
            </el-select>
            <el-select
              v-model="filters.stock"
              :placeholder="$t('admin.filters.stock')"
              class="w-full"
              size="small"
              clearable
              @change="applyFilters"
            >
              <el-option :label="$t('admin.filters.all')" value="" />
              <el-option :label="$t('admin.filters.lowStock')" value="low" />
              <el-option :label="$t('admin.filters.outOfStock')" value="zero" />
            </el-select>
            <el-select
              v-model="filters.creator"
              :placeholder="$t('admin.products.creator')"
              class="w-full"
              size="small"
              clearable
              filterable
              @change="applyFilters"
            >
              <el-option :label="$t('admin.filters.all')" value="" />
              <el-option
                v-for="creator in availableCreators"
                :key="creator.id"
                :label="creator.name"
                :value="String(creator.id)"
              />
            </el-select>
          </form>
        </div>
      </aside>

      <!-- Products Table -->
      <div class="flex-1 min-w-0">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="animate-pulse flex items-center gap-4 px-6 py-4 border-b border-gray-100"
          >
            <div class="h-10 w-10 rounded bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-4 bg-gray-200 rounded w-20" />
            <div class="h-6 w-20 bg-gray-200 rounded" />
            <div class="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="list.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:inventory-2"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.products.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.products.emptyDesc") }}</p>
        <Trubutton
          :text="$t('admin.products.addFirst')"
          type="primary"
          variant="solid"
          icon="material-symbols:add"
          @click="openCreate"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
              >
                {{ $t("admin.table.image") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.product") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.category") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.brand") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.products.tags") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.price") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.stock") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.filters.status") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.products.creator") }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-32"
              >
                {{ $t("admin.table.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="product in list"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <img
                  :src="getProductImage(product.img, product.gallery_img)"
                  :alt="product.tittle || 'product'"
                  class="h-12 w-12 object-cover rounded bg-gray-50"
                  loading="lazy"
                  @error="onImageError"
                  v-bind="imgAttrs('product', product.img)"
                />
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900 truncate max-w-xs">
                    {{ product.tittle || "-" }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ $t("admin.table.productNumber") }}:
                    {{ product.partnumber || product.partnumber_trumecs || "-" }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ getCategoryName(product.component) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ product.brand || "-" }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tid in productTagIds(product.id)"
                    :key="tid"
                    class="px-2 py-0.5 text-[10px] rounded-full bg-orange-100 text-orange-700"
                  >
                    {{ tagLabelById(tid) }}
                  </span>
                  <span
                    v-if="productTagIds(product.id).length === 0"
                    class="text-xs text-gray-400"
                  >-</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">
                  {{ formatCurrency(product.price) }}
                </p>
                <p
                  v-if="product.price_promo && Number(product.price_promo) > 0"
                  class="text-sm text-orange-600 line-through"
                >
                  {{ formatCurrency(product.price) }}
                </p>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStockClass(product.stock)"
                  class="px-2 py-1 text-sm font-medium rounded-full"
                >
                  {{ product.stock ?? 0 }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(product.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(product.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ getCreatorName(product.created_by) }}
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="$t('admin.table.view')"
                    @click="openDetail(product)"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </button>
                  <button
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="$t('admin.table.edit')"
                    @click="openEdit(product)"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </button>
                  <el-dropdown>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          :divided="true"
                          @click="toggleStatus(product)"
                        >
                          {{
                            product.status === "show"
                              ? $t("admin.products.setDraft")
                              : $t("admin.products.setShow")
                          }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="duplicateProduct(product)">
                          {{ $t("admin.products.duplicate") }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          class="text-red-600"
                          @click="deleteProduct(product)"
                        >
                          {{ $t("admin.products.delete") }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                    <button
                      class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                      :title="$t('admin.table.action')"
                    >
                      <Icon name="material-symbols:more-vert" class="h-4 w-4" />
                    </button>
                  </el-dropdown>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalItems > 0"
        class="px-6 py-4 border-t border-gray-200 flex justify-end"
      >
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="goToPage"
          @size-change="handlePageSizeChange"
        />
      </div>
      </div>
    </div>
    </div>

    <!-- Detail Modal -->
    <el-dialog
      v-model="detailVisible"
      :title="$t('admin.products.detail')"
      width="min(700px, 94vw)"
    >
      <div v-if="detailProduct" class="space-y-5 text-sm">
        <div class="flex items-start gap-4">
          <img
            :src="getProductImage(detailProduct.img, detailProduct.gallery_img)"
            :alt="detailProduct.tittle || 'product'"
            class="h-24 w-24 object-cover rounded-lg bg-gray-50"
            @error="onImageError"
          />
          <div>
            <p class="text-lg font-semibold text-gray-900">
              {{ detailProduct.tittle || "-" }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              {{ $t("admin.table.productNumber") }}:
              {{
                detailProduct.partnumber ||
                detailProduct.partnumber_trumecs ||
                "-"
              }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="getStatusClass(detailProduct.status)"
                class="px-2 py-0.5 text-xs font-medium rounded-full"
              >
                {{ getStatusLabel(detailProduct.status) }}
              </span>
              <span
                class="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full"
              >
                {{ getCreatorName(detailProduct.created_by) }}
              </span>
            </div>
          </div>
        </div>

        <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <dt class="text-gray-500">{{ $t("admin.table.category") }}</dt>
            <dd class="text-gray-900">
              {{ getCategoryName(detailProduct.component) }}
            </dd>
          </div>
          <div>
            <dt class="text-gray-500">{{ $t("admin.table.brand") }}</dt>
            <dd class="text-gray-900">{{ detailProduct.brand || "-" }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">{{ $t("admin.table.price") }}</dt>
            <dd class="text-gray-900">
              {{ formatCurrency(detailProduct.price) }}
            </dd>
          </div>
          <div>
            <dt class="text-gray-500">{{ $t("admin.table.stock") }}</dt>
            <dd class="text-gray-900">{{ detailProduct.stock ?? 0 }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">{{ $t("admin.table.moq") }}</dt>
            <dd class="text-gray-900">{{ detailProduct.moq ?? "-" }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">{{ $t("admin.table.type") }}</dt>
            <dd class="text-gray-900">
              {{ detailProduct.jenisproduct || "-" }}
            </dd>
          </div>
          <div>
            <dt class="text-gray-500">{{ $t("admin.products.form.unit") }}</dt>
            <dd class="text-gray-900">{{ detailProduct.unit || "-" }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">
              {{ $t("admin.products.form.quality") }}
            </dt>
            <dd class="text-gray-900">{{ detailProduct.quality || "-" }}</dd>
          </div>
        </dl>

        <div v-if="detailProduct.description">
          <p class="text-gray-500 mb-1">
            {{ $t("admin.products.form.description") }}
          </p>
          <p class="text-gray-900 whitespace-pre-line">
            {{ detailProduct.description }}
          </p>
        </div>

        <!-- Gallery (seperti CI: galery.php) -->
        <div class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <p class="font-semibold text-gray-900">
              {{ $t("admin.products.gallery") || "Gallery Produk" }}
            </p>
            <label
              class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onGalleryFilesChange"
              />
              {{ $t("admin.products.addGallery") || "Tambah Gallery" }}
            </label>
          </div>
          <div
            v-if="detailGalleryImages.length || galleryFiles.length"
            class="grid grid-cols-3 sm:grid-cols-4 gap-3"
          >
            <div
              v-for="(g, idx) in detailGalleryImages"
              :key="'g-' + idx"
              class="relative group"
            >
              <img
                :src="imgSrc('galery', g.img || g)"
                class="h-24 w-full object-cover rounded-lg bg-gray-50"
                @error="onImageError"
              />
              <button
                type="button"
                class="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100"
                @click="removeGalleryImage(idx)"
              >
                ×
              </button>
            </div>
            <div
              v-for="(f, idx) in galleryFiles"
              :key="'f-' + idx"
              class="relative group"
            >
              <img
                :src="URL.createObjectURL(f)"
                class="h-24 w-full object-cover rounded-lg bg-gray-50 opacity-70"
              />
              <button
                type="button"
                class="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded"
                @click="galleryFiles.splice(idx, 1)"
              >
                ×
              </button>
            </div>
          </div>
          <p v-else class="text-gray-400 text-xs">
            {{ $t("admin.products.noGallery") || "Belum ada gallery." }}
          </p>
          <div
            v-if="galleryFiles.length"
            class="mt-3 flex justify-end"
          >
            <Trubutton
              :text="$t('admin.products.saveGallery') || 'Simpan Gallery'"
              type="primary"
              variant="solid"
              size="small"
              :loading="gallerySaving"
              @click="saveGallery"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Trubutton
          :text="$t('button.cancel')"
          type="info"
          variant="ghost"
          @click="detailVisible = false"
        />
        <Trubutton
          :text="$t('admin.table.edit')"
          type="primary"
          variant="solid"
          @click="detailProduct && openEdit(detailProduct)"
        />
      </template>
    </el-dialog>

    <!-- Form Modal (Create / Edit) -->
    <el-dialog
      v-model="formVisible"
      class="product-form-dialog"
      :title="isCreate ? $t('admin.products.addNew') : $t('admin.products.edit')"
      width="min(900px, 96vw)"
      top="6vh"
    >
      <el-form v-if="form" label-position="top">
        <el-form-item
          :label="$t('admin.products.form.jenisProduct')"
          class="!mb-4"
        >
          <el-select
            v-model="form.jenisproduct"
            class="w-full"
            filterable
            clearable
            :placeholder="$t('admin.products.form.jenisPlaceholder')"
            @change="handleJenisChange"
          >
            <el-option
              v-for="jenis in jenisProductOptions"
              :key="jenis"
              :label="jenis"
              :value="jenis"
            />
          </el-select>
        </el-form-item>

        <p class="form-section-title">
          {{ $t("admin.products.form.basicInfo") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <el-form-item
            :label="$t('admin.products.form.title')"
            class="!mb-4"
          >
            <el-input v-model="form.tittle" />
          </el-form-item>
          <el-form-item
            v-if="showPartNumber"
            :label="$t('admin.products.form.partNumber')"
            class="!mb-4"
          >
            <el-input v-model="form.partnumber" />
          </el-form-item>
          <el-form-item
            v-if="showTrumecsNumber"
            :label="
              jenisName === 'unit'
                ? $t('admin.products.form.physicalNumberTrumecs')
                : $t('admin.products.form.partNumberTrumecs')
            "
            class="!mb-4"
          >
            <el-input v-model="form.partnumber_trumecs" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.physicalNumber')"
            class="!mb-4"
          >
            <el-input v-model="form.physicnumber" />
          </el-form-item>
          <el-form-item :label="$t('admin.filters.status')" class="!mb-4">
            <el-select v-model="form.status" class="w-full">
              <el-option :label="$t('admin.filters.show')" value="show" />
              <el-option :label="$t('admin.filters.draft')" value="draft" />
              <el-option label="Hidden" value="hidden" />
            </el-select>
          </el-form-item>
        </div>

        <p class="form-section-title">
          {{ $t("admin.products.form.priceInfo") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <el-form-item :label="$t('admin.table.price')" class="!mb-4">
            <el-input v-model="form.price" type="number" min="0" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.promoPrice')"
            class="!mb-4"
          >
            <el-input v-model="form.price_promo" type="number" min="0" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.priceCbd')"
            class="!mb-4"
          >
            <el-input
              v-model="form.promo_cbd_price"
              type="number"
              min="0"
              step="0.01"
            />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.priceReferral')"
            class="!mb-4"
          >
            <el-input
              v-model="form.promo_referral_price"
              type="number"
              min="0"
              step="0.01"
            />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.volumeMin')"
            class="!mb-4"
          >
            <el-input v-model="form.promo_volume" type="number" min="0" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.volumePrice')"
            class="!mb-4"
          >
            <el-input
              v-model="form.promo_volume_price"
              type="number"
              min="0"
              step="0.01"
            />
          </el-form-item>
        </div>

        <p class="form-section-title">
          {{ $t("admin.products.form.specInfo") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <el-form-item :label="$t('admin.table.category')" class="!mb-4">
            <el-select
              v-model="form.component"
              class="w-full"
              filterable
              :placeholder="$t('admin.products.form.componentPlaceholder')"
            >
              <el-option
                :label="$t('admin.products.noCategory')"
                :value="0"
              />
              <el-option
                v-for="cat in componentOptions"
                :key="cat.id"
                :label="cat.label"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('admin.table.brand')" class="!mb-4">
            <el-select
              v-model="form.brand"
              class="w-full"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="brand in formBrandOptions"
                :key="brand.id"
                :label="brand.name"
                :value="brand.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="showUnitFields && brandUnitOptions.length"
            :label="$t('admin.products.form.brandUnit')"
            class="!mb-4"
          >
            <el-select
              v-model="form.brand_unit"
              class="w-full"
              filterable
              clearable
              @change="handleBrandUnitChange"
            >
              <el-option
                v-for="unit in brandUnitOptions"
                :key="unit.id"
                :label="unit.name"
                :value="unit.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="showUnitFields && typeOptions.length"
            :label="$t('admin.products.form.typeUnit')"
            class="!mb-4"
          >
            <el-select
              v-model="form.type"
              class="w-full"
              filterable
              clearable
            >
              <el-option
                v-for="tipe in typeOptions"
                :key="tipe.id"
                :label="tipe.label"
                :value="tipe.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.quality')"
            class="!mb-4"
          >
            <el-select v-model="form.quality" class="w-full">
              <el-option
                v-for="grade in grades"
                :key="grade.id"
                :label="grade.name"
                :value="grade.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.area')"
            class="!mb-4"
          >
            <el-select
              v-model="form.area"
              class="w-full"
              clearable
              filterable
            >
              <el-option
                v-for="area in areas"
                :key="area.id"
                :label="area.name"
                :value="area.name"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item :label="$t('admin.products.form.tags')" class="!mb-4">
          <div class="w-full space-y-2">
            <el-select
              v-model="form.tag_ids"
              multiple
              filterable
              class="w-full"
              :placeholder="$t('admin.products.form.tagsPlaceholder')"
            >
              <el-option
                v-for="tag in allTags"
                :key="tag.id"
                :label="tag.tag || tag.tag_en"
                :value="Number(tag.id)"
              />
            </el-select>

            <div
              v-if="showNewTag"
              class="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2"
            >
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <el-input
                  v-model="newTag.tag"
                  size="small"
                  :placeholder="$t('admin.products.form.newTag')"
                />
                <el-input
                  v-model="newTag.tag_en"
                  size="small"
                  :placeholder="$t('admin.products.form.newTagEn')"
                />
                <el-input
                  v-model="newTag.tag_ch"
                  size="small"
                  :placeholder="$t('admin.products.form.newTagCh')"
                />
              </div>
              <div class="flex gap-2">
                <Trubutton
                  :text="$t('admin.products.form.addTag')"
                  type="primary"
                  variant="solid"
                  size="small"
                  icon="material-symbols:add"
                  :loading="creatingTag"
                  @click="handleCreateTag"
                />
                <Trubutton
                  :text="$t('button.cancel')"
                  type="info"
                  variant="ghost"
                  size="small"
                  @click="cancelNewTag"
                />
              </div>
            </div>
            <Trubutton
              v-else
              :text="$t('admin.products.form.addTag')"
              type="primary"
              variant="ghost"
              size="small"
              icon="material-symbols:add"
              @click="showNewTag = true"
            />
          </div>
        </el-form-item>

        <el-form-item
          :label="$t('admin.products.form.attributes')"
          class="!mb-4"
        >
          <div class="w-full space-y-2">
            <div
              v-for="(attr, index) in form.attributes"
              :key="index"
              class="flex items-center gap-2"
            >
              <el-input
                v-model="attr.name"
                size="small"
                :placeholder="$t('admin.products.form.attributeName')"
              />
              <el-input
                v-model="attr.value"
                size="small"
                :placeholder="$t('admin.products.form.attributeValue')"
              />
              <button
                type="button"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                :title="$t('admin.table.delete')"
                @click="removeAttribute(index)"
              >
                <Icon name="material-symbols:delete" class="h-4 w-4" />
              </button>
            </div>
            <Trubutton
              :text="$t('admin.products.form.addAttribute')"
              type="primary"
              variant="ghost"
              size="small"
              icon="material-symbols:add"
              @click="addAttribute"
            />
          </div>
        </el-form-item>

        <p class="form-section-title">
          {{ $t("admin.products.form.stockInfo") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <el-form-item :label="$t('admin.table.stock')" class="!mb-4">
            <el-input v-model="form.stock" type="number" min="0" />
          </el-form-item>
          <el-form-item :label="$t('admin.table.moq')" class="!mb-4">
            <el-input v-model="form.moq" type="number" min="0" />
          </el-form-item>
          <el-form-item :label="$t('admin.products.form.unit')" class="!mb-4">
            <el-input
              v-model="form.unit"
              :placeholder="$t('admin.products.form.unitPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="$t('admin.products.form.weight')" class="!mb-4">
            <el-input
              v-model="form.weight"
              :placeholder="$t('admin.products.form.weightPlaceholder')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.dimention')"
            class="!mb-4"
          >
            <el-input
              v-model="form.dimention"
              :placeholder="$t('admin.products.form.dimentionPlaceholder')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.packagin')"
            class="!mb-4"
          >
            <el-select
              v-model="form.packagin"
              class="w-full"
              clearable
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="option in PACKAGING_OPTIONS"
                :key="option"
                :label="option"
                :value="option"
              />
            </el-select>
          </el-form-item>
        </div>

        <p class="form-section-title">
          {{ $t("admin.products.form.warrantyInfo") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <el-form-item
            :label="$t('admin.products.form.warranty')"
            class="!mb-4"
          >
            <el-input v-model="form.warranty" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.warrantyVendor')"
            class="!mb-4"
          >
            <el-input v-model="form.warrantyvendor" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.livetime')"
            class="!mb-4"
          >
            <el-input v-model="form.livetime" />
          </el-form-item>
        </div>

        <p class="form-section-title">
          {{ $t("admin.products.form.shippingInfo") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <el-form-item
            :label="$t('admin.products.form.estimatedDelivery')"
            class="!mb-4"
          >
            <el-input
              v-model="form.estimated_delivery"
              type="number"
              min="0"
            />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.estimatedIndent')"
            class="!mb-4"
          >
            <el-input
              v-model="form.estimated_deliveryindent"
              type="number"
              min="0"
            />
          </el-form-item>
        </div>

        <p class="form-section-title">
          {{ $t("admin.products.form.mediaInfo") }}
        </p>
        <el-form-item
          :label="$t('admin.products.form.image')"
          class="!mb-4"
        >
          <div class="flex items-start gap-4">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept="image/jpeg,image/jpg,image/png"
              :on-change="onImageChange"
            >
              <div
                class="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  :alt="$t('admin.products.form.image')"
                  class="w-full h-full object-cover"
                />
                <Icon
                  v-else
                  name="material-symbols:add-photo-alternate"
                  class="text-3xl text-gray-400"
                />
              </div>
            </el-upload>
            <div class="text-xs text-gray-500 space-y-1">
              <p>{{ $t("admin.products.form.imageHint") }}</p>
              <p v-if="isCreate" class="text-orange-600">
                {{ $t("admin.products.form.imageRequired") }}
              </p>
              <p v-if="form.imageFile" class="text-gray-700">
                {{ form.imageFile.name }}
              </p>
            </div>
          </div>
        </el-form-item>

        <el-form-item :label="$t('admin.products.form.description')" class="!mb-0">
          <el-input v-model="form.description" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <Trubutton
          :text="$t('button.cancel')"
          type="info"
          variant="ghost"
          @click="formVisible = false"
        />
        <Trubutton
          :text="$t('button.save')"
          type="primary"
          variant="solid"
          :loading="saving"
          @click="saveForm"
        />
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useConfirm } from "~/composables/useConfirm";
import {
  useAdminProducts,
  PACKAGING_OPTIONS,
} from "~/composables/useAdminProducts";
import { useImageUrl } from "~/composables/useImageUrl";
import { useAdminStore } from "~/stores/admin";
import type { AdminProduct } from "~/composables/useAdminProducts";

const { imgSrc, imgAttrs } = useImageUrl();
const adminStore = useAdminStore();
const config = useRuntimeConfig();

definePageMeta({ layout: "admin" });

const { t: $t } = useI18n();
const { confirmDelete } = useConfirm();

const {
  loading,
  saving,
  list,
  filters,
  categories,
  categoryRoots,
  brands,
  creators,
  brandOptions,
  statusOptions,
  availableCategories,
  availableBrands,
  availableStatuses,
  availableCreators,
  grades,
  areas,
  allTags,
  productTagIds,
  currentPage,
  pageSize,
  totalItems,
  applyFilters,
  goToPage,
  fetchProductDetail,
  createProduct,
  updateProduct,
  createTag,
  deleteProduct: apiDeleteProduct,
  toggleStatus: apiToggleStatus,
  duplicateProduct: apiDuplicateProduct,
  init,
} = useAdminProducts();

const detailVisible = ref(false);
const detailProduct = ref<AdminProduct | null>(null);
const formVisible = ref(false);
const isCreate = ref(true);
const original = ref<AdminProduct | null>(null);
const form = ref<Record<string, any>>({});

// ---- State tambahan form produk (mengikuti form CI) ----
const imagePreview = ref("");
const showNewTag = ref(false);
const creatingTag = ref(false);
const newTag = ref({ tag: "", tag_en: "", tag_ch: "" });

// ---- State gallery produk (mengikuti CI galery.php) ----
const galleryFiles = ref<File[]>([]);
const gallerySaving = ref(false);
const detailGalleryImages = ref<any[]>([]);

// Jenis produk di CI = nama kategori induk (lihat form.php: parent = 0)
const jenisProductOptions = computed(() => {
  const names = categories.value
    .filter((cat: any) => !cat.parent)
    .map((cat: any) => cat.name)
    .filter(Boolean);
  return Array.from(new Set(names));
});

// ---- Perilaku saat memilih jenis produk (meniru form.product.js di CI) ----
const jenisName = computed(() =>
  String(form.value.jenisproduct || "").trim().toLowerCase()
);

// CI: toggleJenisProductFields()
// - Sparepart / Aksesoris -> tampilkan blok Part Number (+ Part Number Trumecs)
// - Unit                  -> tampilkan Fisik Number Trumecs
// - lainnya               -> keduanya disembunyikan
const isSparepartJenis = computed(() =>
  ["sparepart", "aksesoris"].includes(jenisName.value)
);
const showPartNumber = computed(() => isSparepartJenis.value);
const showTrumecsNumber = computed(
  () => isSparepartJenis.value || jenisName.value === "unit"
);
// brand_unit & type hanya untuk Sparepart/Aksesoris/Unit (di CI di-disable selain itu)
const showUnitFields = computed(() =>
  ["sparepart", "aksesoris", "unit"].includes(jenisName.value)
);

const jenisRoot = computed(() => {
  if (!jenisName.value) return null;
  return (
    (categoryRoots.value as any[]).find(
      (root: any) =>
        String(root?.name || "").trim().toLowerCase() === jenisName.value
    ) || null
  );
});

function findTreeNode(nodes: any[], id: number): any {
  for (const node of nodes || []) {
    if (Number(node.id) === id) return node;
    const found = findTreeNode(node.children || [], id);
    if (found) return found;
  }
  return null;
}

// CI: general/getcomponentall_form/<jenis>
// -> kategori induk + seluruh subkategori dengan label "Induk > Anak"
const componentOptions = computed(() => {
  const root: any = jenisRoot.value;
  if (!root) return [] as { id: number; label: string }[];

  const out: { id: number; label: string }[] = [
    { id: Number(root.id), label: root.name },
  ];
  const walk = (nodes: any[], prefix: string) => {
    for (const node of nodes || []) {
      out.push({ id: Number(node.id), label: `${prefix} > ${node.name}` });
      walk(node.children || [], `${prefix} > ${node.name}`);
    }
  };
  walk(root.children || [], root.name);
  return out;
});

// CI: general/getbrandform/<jenis> -> merek milik kategori induk terpilih
const formBrandOptions = computed(() => {
  const list = (jenisRoot.value as any)?.brands;
  if (Array.isArray(list) && list.length) return list;
  return brands.value;
});

// Merek unit: CI memakai merek dari kategori id 117
const brandUnitOptions = computed(() => {
  const roots = categoryRoots.value as any[];
  const unitRoot =
    roots.find((root: any) => Number(root.id) === 117) ||
    roots.find((root: any) => /^unit$/i.test(String(root?.name || "").trim()));
  return (unitRoot?.brands || []) as { id: number; name: string }[];
});

// Tipe unit: CI (general/gettype/<merek unit>) memakai sub-kategori
const typeOptions = computed(() => {
  const id = Number(form.value.brand_unit) || 0;
  if (!id) return [] as { id: number; label: string }[];
  const node = findTreeNode([jenisRoot.value].filter(Boolean), id);
  if (!node) return [] as { id: number; label: string }[];
  const out: { id: number; label: string }[] = [];
  const walk = (nodes: any[], prefix: string) => {
    for (const child of nodes || []) {
      out.push({ id: Number(child.id), label: `${prefix} > ${child.name}` });
      walk(child.children || [], `${prefix} > ${child.name}`);
    }
  };
  walk(node.children || [], node.name);
  return out;
});

const handleJenisChange = () => {
  // CI memuat ulang brand & component -> pilihan lama yang tidak valid direset
  const allowedComponents = new Set(componentOptions.value.map((o) => o.id));
  const component = Number(form.value.component) || 0;
  if (component && !allowedComponents.has(component)) {
    form.value.component = 0;
  }

  const allowedBrands = new Set(
    formBrandOptions.value.map((b: any) => String(b?.name || "").toLowerCase())
  );
  if (
    form.value.brand &&
    !allowedBrands.has(String(form.value.brand).toLowerCase())
  ) {
    form.value.brand = "";
  }

  // CI memuat ulang template atribut per jenis produk (hanya saat tambah baru)
  if (isCreate.value) form.value.attributes = [];
};

const handleBrandUnitChange = () => {
  const allowed = new Set(typeOptions.value.map((o) => o.id));
  const current = Number(form.value.type) || 0;
  if (current && !allowed.has(current)) form.value.type = null;
};

const emptyForm = () => ({
  tittle: "",
  partnumber: "",
  partnumber_trumecs: "",
  physicnumber: "",
  component: 0,
  brand: "",
  brand_unit: null,
  type: null,
  quality: "Asli",
  area: "",
  tag_ids: [],
  price: "",
  price_promo: "",
  promo_cbd_price: "",
  promo_referral_price: "",
  promo_volume: "",
  promo_volume_price: "",
  stock: 0,
  moq: 1,
  unit: "1 Pc",
  weight: "",
  dimention: "",
  packagin: "",
  warranty: "",
  warrantyvendor: "",
  livetime: "",
  jenisproduct: "",
  availability_at: "INDONESIA",
  estimated_delivery: 3,
  estimated_deliveryindent: 7,
  status: "show",
  img: "",
  description: "",
  attributes: [] as { name: string; value: string }[],
  // false = detail produk gagal dimuat -> atribut lama jangan dihapus
  attributesLoaded: false,
  imageFile: null as File | null,
});

const openCreate = () => {
  form.value = emptyForm();
  original.value = null;
  isCreate.value = true;
  imagePreview.value = "";
  showNewTag.value = false;
  newTag.value = { tag: "", tag_en: "", tag_ch: "" };
  formVisible.value = true;
};

/** Deskripsi di database memakai <br /> (hasil nl2br di CI) -> balik ke newline. */
const brToNewline = (value?: string | null) =>
  String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n");

const openEdit = async (product: AdminProduct) => {
  saving.value = true;
  try {
    // Ambil detail lengkap supaya field lain tidak hilang saat disimpan
    const detail = await fetchProductDetail(product.id);
    const src = detail || product;
    const attributesSource = (src as any).specs || (src as any).attribute || [];
    const hasDimention =
      Number((src as any).sx) ||
      Number((src as any).sy) ||
      Number((src as any).sz);

    original.value = src;
    form.value = {
      id: src.id,
      tittle: src.tittle || "",
      partnumber: src.partnumber || "",
      partnumber_trumecs: src.partnumber_trumecs || "",
      physicnumber: src.physicnumber || "",
      component: src.component || 0,
      brand: src.brand || "",
      brand_unit: (src as any).brand_unit ?? null,
      type: (src as any).type ?? null,
      quality: src.quality || "Asli",
      area: src.area || "",
      tag_ids: productTagIds.value(src.id),
      price: src.price ?? "",
      price_promo: src.price_promo ?? "",
      promo_cbd_price: (src as any).promo_cbd_price ?? "",
      promo_referral_price: (src as any).promo_referral_price ?? "",
      promo_volume: (src as any).promo_volume ?? "",
      promo_volume_price: (src as any).promo_volume_price ?? "",
      stock: src.stock ?? 0,
      moq: src.moq ?? 1,
      unit: src.unit || "1 Pc",
      weight: (src as any).weight ?? "",
      dimention: hasDimention
        ? `${Number((src as any).sx) || 0}x${Number((src as any).sy) || 0}x${
            Number((src as any).sz) || 0
          }`
        : "",
      packagin: src.packagin || "",
      warranty: src.warranty || "",
      warrantyvendor: (src as any).warrantyvendor || "",
      livetime: (src as any).livetime || "",
      jenisproduct: src.jenisproduct || "",
      availability_at: src.availability_at || "INDONESIA",
      estimated_delivery: Number((src as any).estimated_delivery ?? 3) || 3,
      estimated_deliveryindent:
        Number((src as any).estimated_deliveryindent ?? 7) || 7,
      status: src.status || "show",
      img: src.img || "",
      description: brToNewline(src.description),
      attributes: (Array.isArray(attributesSource) ? attributesSource : []).map(
        (attr: any) => ({
          name: String(attr?.name ?? ""),
          value: String(attr?.value ?? ""),
        })
      ),
      attributesLoaded: !!detail,
      imageFile: null,
    };
    imagePreview.value = src.img ? imgSrc("product", src.img) : "";
    showNewTag.value = false;
    newTag.value = { tag: "", tag_en: "", tag_ch: "" };
    isCreate.value = false;
    formVisible.value = true;
    detailVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e?.data?.message || $t("admin.products.loadFailed"));
  } finally {
    saving.value = false;
  }
};

const openDetail = (product: AdminProduct) => {
  detailProduct.value = product;
  detailGalleryImages.value = Array.isArray(product?.gallery_img)
    ? [...product.gallery_img]
    : [];
  galleryFiles.value = [];
  detailVisible.value = true;
};

// ---- Pagination ----
const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  goToPage(1);
};

// ---- Upload gambar produk (multipart ke product/create / product/update) ----
const onImageChange = (uploadFile: any) => {
  const raw: File | undefined = uploadFile?.raw;
  if (!raw) return;

  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (raw.type && !allowed.includes(raw.type)) {
    ElMessage.error($t("admin.products.form.imageType"));
    return;
  }
  if (raw.size > 5 * 1024 * 1024) {
    ElMessage.error($t("admin.products.form.imageSize"));
    return;
  }

  form.value.imageFile = raw;
  imagePreview.value = URL.createObjectURL(raw);
};

// ---- Atribut produk dinamis (CI: attribute[] / value[]) ----
const addAttribute = () => {
  if (!Array.isArray(form.value.attributes)) form.value.attributes = [];
  form.value.attributes.push({ name: "", value: "" });
  form.value.attributesLoaded = true;
};

const removeAttribute = (index: number) => {
  form.value.attributes?.splice(index, 1);
};

// ---- Tambah tag baru langsung dari form produk ----
const handleCreateTag = async () => {
  if (!String(newTag.value.tag || "").trim()) {
    ElMessage.error($t("admin.products.form.tagRequired"));
    return;
  }
  creatingTag.value = true;
  try {
    const created: any = await createTag({ ...newTag.value });
    const id = Number(created?.id);
    if (id) {
      const ids: number[] = Array.isArray(form.value.tag_ids)
        ? form.value.tag_ids
        : [];
      if (!ids.includes(id)) ids.push(id);
      form.value.tag_ids = ids;
    }
    ElMessage.success($t("admin.products.form.tagCreated"));
    cancelNewTag();
  } catch (e: any) {
    ElMessage.error(
      e?.data?.message ||
        e?.message ||
        $t("admin.products.form.tagCreateFailed")
    );
  } finally {
    creatingTag.value = false;
  }
};

const cancelNewTag = () => {
  showNewTag.value = false;
  newTag.value = { tag: "", tag_en: "", tag_ch: "" };
};

const onGalleryFilesChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files) return;
  for (let i = 0; i < files.length; i++) {
    galleryFiles.value.push(files[i]);
  }
  input.value = "";
};

const removeGalleryImage = (index: number) => {
  detailGalleryImages.value.splice(index, 1);
};

const saveGallery = async () => {
  if (!detailProduct.value) return;
  gallerySaving.value = true;
  try {
    // Kirim file baru lewat multipart "images" ke product/update.
    // Server akan menyimpan file dan menambahkannya ke gallery_img produk.
    if (galleryFiles.value.length) {
      const fd = new FormData();
      fd.append("id", String(detailProduct.value.id));
      for (const f of galleryFiles.value) fd.append("images", f, f.name);
      // pertahankan field lain agar tidak ter-null-kan
      fd.append("tittle", detailProduct.value.tittle || "");
      fd.append("status", detailProduct.value.status || "show");
      fd.append("created_by", String(detailProduct.value.created_by ?? 0));
      fd.append("store_id", String(detailProduct.value.store_id ?? 0));
      await fetch(`${config.public.baseURL}product/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${adminStore.token}` },
        body: fd,
      });
      galleryFiles.value = [];
    }
    // Sinkronkan penghapusan gallery: kirim gallery_img yang tersisa
    // (server mengabaikan field ini pada sebagian versi, tapi dicoba).
    const remaining = detailGalleryImages.value.map((g: any) => ({
      img: g?.img || g,
    }));
    try {
      await updateProduct(
        detailProduct.value.id,
        { gallery_img: remaining } as any,
        detailProduct.value,
        null
      );
    } catch {
      /* ignore */
    }
    ElMessage.success(
      $t("admin.products.gallerySaved") || "Gallery disimpan"
    );
    detailVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e?.data?.message || e?.message || "Gagal menyimpan gallery");
  } finally {
    gallerySaving.value = false;
  }
};
const saveForm = async () => {
  if (!form.value.tittle || !String(form.value.tittle).trim()) {
    ElMessage.error($t("admin.products.form.titleRequired"));
    return;
  }
  if (isCreate.value && !form.value.imageFile) {
    ElMessage.error($t("admin.products.form.imageRequired"));
    return;
  }

  const body: Record<string, any> = { ...form.value };
  const imageFile: File | null = body.imageFile || null;
  delete body.imageFile;

  // Atribut: kosongkan baris yang tidak lengkap
  if (form.value.attributesLoaded && Array.isArray(body.attributes)) {
    body.attributes = body.attributes
      .map((attr: any) => ({
        name: String(attr?.name ?? "").trim(),
        value: String(attr?.value ?? "").trim(),
      }))
      .filter((attr: any) => attr.name !== "" && attr.value !== "");
  } else {
    // detail gagal dimuat -> jangan hapus atribut lama
    delete body.attributes;
  }

  body.tag_ids = (form.value.tag_ids || [])
    .map((x: any) => Number(x))
    .filter((x: number) => !!x);

  // Nilai kosong dikirim sebagai null agar tidak menimpa nilai lama dengan string kosong
  for (const key of Object.keys(body)) {
    if (body[key] === "") body[key] = null;
  }

  try {
    if (isCreate.value) {
      await createProduct(body, imageFile);
      ElMessage.success($t("admin.products.created"));
    } else {
      await updateProduct(Number(body.id), body, original.value, imageFile);
      ElMessage.success($t("admin.products.updated"));
    }
    formVisible.value = false;
  } catch (e: any) {
    ElMessage.error(
      e?.data?.message ||
        e?.message ||
        (isCreate.value
          ? $t("admin.products.createFailed")
          : $t("admin.products.updateFailed"))
    );
  }
};

const toggleStatus = async (product: AdminProduct) => {
  try {
    await apiToggleStatus(product);
    ElMessage.success($t("admin.products.statusUpdated"));
  } catch (e: any) {
    ElMessage.error(e?.data?.message || $t("admin.products.updateFailed"));
  }
};

const duplicateProduct = async (product: AdminProduct) => {
  try {
    await apiDuplicateProduct(product);
    ElMessage.success($t("admin.products.duplicated"));
  } catch (e: any) {
    ElMessage.error(e?.data?.message || $t("admin.products.createFailed"));
  }
};

const deleteProduct = async (product: AdminProduct) => {
  try {
    await confirmDelete(product.tittle || $t("admin.table.product"));
    await apiDeleteProduct(product.id);
    ElMessage.success($t("admin.products.deleted"));
  } catch {
    // dibatalkan user
  }
};

// ---- Helper tampilan ----
const getStatusLabel = (status?: string | null) => {
  const value = String(status ?? "").trim();
  const labelKeys: Record<string, string> = {
    show: "admin.products.statuses.show",
    draft: "admin.products.statuses.draft",
    hidden: "admin.products.statuses.hidden",
  };
  return labelKeys[value] ? $t(labelKeys[value]) : value || "-";
};

const getStatusClass = (status?: string | null) => {
  const classes: Record<string, string> = {
    show: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    hidden: "bg-red-100 text-red-800",
  };
  return classes[String(status ?? "")] || "bg-gray-100 text-gray-800";
};

const getStockClass = (stock?: number | null) => {
  const value = Number(stock || 0);
  if (value === 0) return "bg-red-100 text-red-800";
  if (value <= 5) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

const formatCurrency = (amount?: string | number | null) => {
  const value = Number(amount || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getCategoryName = (component?: number | null) => {
  if (!component) return "-";
  const cat = categories.value.find((c) => c.id === Number(component));
  return cat ? cat.name : "-";
};

const tagLabelById = (id: number) => {
const t = (allTags.value || []).find((x: any) => Number(x.id) === Number(id));
return t ? t.tag || t.tag_en || t.tag_ch || String(id) : String(id);
};

const getCreatorName = (createdBy?: number | null) => {
  if (!createdBy) return "-";
  const creator = creators.value.find((c) => c.id === Number(createdBy));
  return creator ? creator.name : "-";
};

const getProductImage = (img?: string | null, gallery?: any) => {
  const file =
    img ||
    (Array.isArray(gallery) && gallery.length ? gallery[0]?.img : null);
  return imgSrc("product", file);
};

const onImageError = (event: Event) => {
  const el = event.target as HTMLImageElement;
  if (el && el.src.indexOf("noimage") === -1) {
    el.src = "/image/noimage.png";
  }
};

onMounted(async () => {
  await init();
});
</script>

<style scoped>
.form-section-title {
  margin: 1.5rem 0 0.75rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ea580c;
}

.form-section-title:first-of-type {
  margin-top: 0.5rem;
}
</style>

<style>
/* Dialog form produk: body bisa discroll (teleport ke body, jadi tidak bisa scoped) */
.product-form-dialog .el-dialog__body {
  max-height: 68vh;
  overflow-y: auto;
  padding-right: 12px;
}
</style>
