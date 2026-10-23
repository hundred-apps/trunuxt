<template>
  <div class="admin-products">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.products.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.products.subtitle") }}</p>
        <p
          v-if="!isSuperAdmin"
          class="mt-1 text-xs text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded"
        >
          {{ $t("admin.products.onlyOwn") }}
        </p>
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

    <!-- Filter Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <form
        @submit.prevent="applyFilters"
        class="flex flex-col lg:flex-row gap-4"
      >
        <div class="flex-1">
          <el-input
            v-model="filters.keyword"
            :placeholder="$t('admin.products.searchPlaceholder')"
            class="w-full"
            prefix-icon="material-symbols:search"
            clearable
            @keyup.enter="applyFilters"
            @clear="applyFilters"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <el-select
            v-model="filters.category"
            :placeholder="$t('admin.table.category')"
            class="w-48"
            size="small"
            clearable
            filterable
            @change="applyFilters"
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              v-for="cat in categories"
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
            class="w-44"
            size="small"
            clearable
            filterable
            @change="applyFilters"
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              v-for="brand in brandOptions"
              :key="brand"
              :label="brand"
              :value="brand"
            />
          </el-select>
          <el-select
            v-model="filters.status"
            :placeholder="$t('admin.filters.status')"
            class="w-36"
            size="small"
            clearable
            @change="applyFilters"
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              v-for="status in statusOptions"
              :key="status"
              :label="getStatusLabel(status)"
              :value="status"
            />
          </el-select>
          <el-select
            v-model="filters.stock"
            :placeholder="$t('admin.filters.stock')"
            class="w-36"
            size="small"
            clearable
            @change="applyFilters"
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option :label="$t('admin.filters.lowStock')" value="low" />
            <el-option :label="$t('admin.filters.outOfStock')" value="zero" />
          </el-select>
          <el-select
            v-if="isSuperAdmin"
            v-model="filters.creator"
            :placeholder="$t('admin.products.creator')"
            class="w-44"
            size="small"
            clearable
            filterable
            @change="applyFilters"
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option
              v-for="creator in creators"
              :key="creator.id"
              :label="creator.name"
              :value="String(creator.id)"
            />
          </el-select>
        </div>
      </form>
    </div>

    <!-- Products Table -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
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
                v-if="isSuperAdmin"
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
                  :src="getProductImage(product.img)"
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
              <td v-if="isSuperAdmin" class="px-6 py-4 text-sm text-gray-500">
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
      <div class="px-6 py-4 border-t border-gray-200" v-if="totalPages > 1">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="goToPage"
        />
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
            :src="getProductImage(detailProduct.img)"
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
                v-if="isSuperAdmin"
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
            <dt class="text-gray-500">Unit</dt>
            <dd class="text-gray-900">{{ detailProduct.unit || "-" }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Quality</dt>
            <dd class="text-gray-900">{{ detailProduct.quality || "-" }}</dd>
          </div>
        </dl>

        <div v-if="detailProduct.description">
          <p class="text-gray-500 mb-1">Deskripsi</p>
          <p class="text-gray-900 whitespace-pre-line">
            {{ detailProduct.description }}
          </p>
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
      :title="isCreate ? $t('admin.products.addNew') : $t('admin.products.edit')"
      width="min(900px, 96vw)"
      top="6vh"
    >
      <el-form v-if="form" label-position="top">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <el-form-item
            :label="$t('admin.products.form.title')"
            class="!mb-4"
          >
            <el-input v-model="form.tittle" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.partNumber')"
            class="!mb-4"
          >
            <el-input v-model="form.partnumber" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.partNumberTrumecs')"
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
          <el-form-item
            :label="$t('admin.table.category')"
            class="!mb-4"
          >
            <el-select v-model="form.component" class="w-full" filterable>
              <el-option
                :label="$t('admin.products.noCategory')"
                :value="0"
              />
              <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.parent ? `${cat.parent} / ${cat.name}` : cat.name"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('admin.products.form.tags')" class="!mb-4">
            <el-select
              v-model="form.tag_ids"
              multiple
              filterable
              class="w-full"
              placeholder="Pilih tag"
            >
              <el-option
                v-for="tag in allTags"
                :key="tag.id"
                :label="tag.tag || tag.tag_en"
                :value="Number(tag.id)"
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
                v-for="brand in brands"
                :key="brand.id"
                :label="brand.name"
                :value="brand.name"
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
          <el-form-item
            :label="$t('admin.table.price')"
            class="!mb-4"
          >
            <el-input v-model="form.price" type="number" min="0" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.promoPrice')"
            class="!mb-4"
          >
            <el-input v-model="form.price_promo" type="number" min="0" />
          </el-form-item>
          <el-form-item :label="$t('admin.table.stock')" class="!mb-4">
            <el-input v-model="form.stock" type="number" min="0" />
          </el-form-item>
          <el-form-item :label="$t('admin.table.moq')" class="!mb-4">
            <el-input v-model="form.moq" type="number" min="0" />
          </el-form-item>
          <el-form-item :label="$t('admin.table.type')" class="!mb-4">
            <el-input v-model="form.jenisproduct" />
          </el-form-item>
          <el-form-item label="Unit" class="!mb-4">
            <el-input v-model="form.unit" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.warranty')"
            class="!mb-4"
          >
            <el-input v-model="form.warranty" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.made')"
            class="!mb-4"
          >
            <el-input v-model="form.made" />
          </el-form-item>
          <el-form-item
            :label="$t('admin.filters.status')"
            class="!mb-4"
          >
            <el-select v-model="form.status" class="w-full">
              <el-option
                :label="$t('admin.filters.show')"
                value="show"
              />
              <el-option
                :label="$t('admin.filters.draft')"
                value="draft"
              />
              <el-option label="Hidden" value="hidden" />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('admin.products.form.image')"
            class="!mb-4"
          >
            <el-input v-model="form.img" placeholder="nama-file.jpg" />
          </el-form-item>
        </div>

        <el-form-item label="Deskripsi" class="!mb-0">
          <el-input v-model="form.description" type="textarea" :rows="4" />
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
const { imgSrc, imgAttrs } = useImageUrl();

import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useConfirm } from "~/composables/useConfirm";
import { useAdminProducts } from "~/composables/useAdminProducts";
import type { AdminProduct } from "~/composables/useAdminProducts";
import { useImageUrl } from "~/composables/useImageUrl";

definePageMeta({ layout: "admin" });

const { t: $t } = useI18n();
const { confirmDelete } = useConfirm();

const {
  loading,
  saving,
  list,
  filters,
  categories,
  brands,
  creators,
  brandOptions,
  statusOptions,
  grades,
  areas,
  allTags,
  productTagIds,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  isSuperAdmin,
  applyFilters,
  goToPage,
  fetchProductDetail,
  createProduct,
  updateProduct,
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

const emptyForm = () => ({
  tittle: "",
  partnumber: "",
  partnumber_trumecs: "",
  physicnumber: "",
  component: 0,
  brand: "",
  quality: "Asli",
  area: "",
  tag_ids: [],
  price: "",
  price_promo: "",
  stock: 0,
  moq: 1,
  jenisproduct: "",
  unit: "",
  warranty: "",
  made: "",
  packagin: "",
  weight: "",
  availability_at: "",
  status: "show",
  img: "",
  description: "",
});

const openCreate = () => {
  form.value = emptyForm();
  original.value = null;
  isCreate.value = true;
  formVisible.value = true;
};

const openEdit = async (product: AdminProduct) => {
  saving.value = true;
  try {
    // Ambil detail lengkap supaya field lain tidak hilang saat disimpan
    const detail = await fetchProductDetail(product.id);
    const src = detail || product;
    original.value = src;
    form.value = {
      id: src.id,
      tittle: src.tittle || "",
      partnumber: src.partnumber || "",
      partnumber_trumecs: src.partnumber_trumecs || "",
      physicnumber: src.physicnumber || "",
      component: src.component || 0,
      brand: src.brand || "",
      quality: src.quality || "Asli",
      area: src.area || "",
      tag_ids: productTagIds(src.id),
      price: src.price ?? "",
      price_promo: src.price_promo ?? "",
      stock: src.stock ?? 0,
      moq: src.moq ?? 1,
      jenisproduct: src.jenisproduct || "",
      unit: src.unit || "",
      warranty: src.warranty || "",
      made: src.made || "",
      packagin: src.packagin || "",
      weight: src.weight || "",
      availability_at: src.availability_at || "",
      status: src.status || "show",
      img: src.img || "",
      description: src.description || "",
    };
    isCreate.value = false;
    formVisible.value = true;
    detailVisible.value = false;
  } catch (e: any) {
    ElMessage.error(
      e?.data?.message || $t("admin.products.loadFailed")
    );
  } finally {
    saving.value = false;
  }
};

const openDetail = (product: AdminProduct) => {
  detailProduct.value = product;
  detailVisible.value = true;
};

const saveForm = async () => {
  if (!form.value.tittle || !String(form.value.tittle).trim()) {
    ElMessage.error($t("admin.products.form.titleRequired"));
    return;
  }
  const body = { ...form.value };
  body.tag_ids = (form.value.tag_ids || []).map((x: any) => Number(x));
  // Nilai kosong dikirim sebagai null agar tidak menimpa nilai lama dengan string kosong
  for (const key of Object.keys(body)) {
    if (body[key] === "") body[key] = null;
  }
  try {
    if (isCreate.value) {
      await createProduct(body);
      ElMessage.success($t("admin.products.created"));
    } else {
      await updateProduct(Number(body.id), body, original.value);
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
    await confirmDelete(product.tittle || "Produk", $t("admin.products.delete"));
    await apiDeleteProduct(product.id);
    ElMessage.success($t("admin.products.deleted"));
  } catch {
    // dibatalkan user
  }
};

// ---- Helper tampilan ----
const getStatusLabel = (status?: string | null) => {
  const labels: Record<string, string> = {
    show: "Tampil",
    draft: "Draft",
    hidden: "Tersembunyi",
  };
  return labels[String(status ?? "")] || status || "-";
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
  const t = allTags?.find((x: any) => Number(x.id) === Number(id));
  return t ? t.tag || t.tag_en || t.tag_ch || String(id) : String(id);
};

const getCreatorName = (createdBy?: number | null) => {
  if (!createdBy) return "-";
  const creator = creators.value.find((c) => c.id === Number(createdBy));
  return creator ? creator.name : "-";
};

const getProductImage = (img?: string | null) => imgSrc("product", img);

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
