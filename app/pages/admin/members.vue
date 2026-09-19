<template>
  <div class="admin-members">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ $t("admin.members.title") }}
        </h1>
        <p class="mt-1 text-gray-600">{{ $t("admin.members.subtitle") }}</p>
      </div>
      <Trubutton
        :text="$t('admin.members.addNew')"
        type="primary"
        variant="solid"
        icon="material-symbols:person-add"
        @click="openCreate"
      />
    </div>

    <!-- Filter Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <form
        @submit.prevent="applyFilters"
        class="flex flex-col lg:flex-row gap-4"
      >
        <div class="flex-1">
          <el-input
            v-model="filters.search"
            placeholder="Cari nama, email, perusahaan..."
            class="w-full"
            prefix-icon="material-symbols:search"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <el-select
            v-model="filters.status"
            placeholder="Status"
            class="w-40"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option :label="$t('admin.filters.active')" value="active" />
            <el-option :label="$t('admin.filters.inactive')" value="inactive" />
          </el-select>
          <el-select
            v-model="filters.level"
            placeholder="Level"
            class="w-40"
            size="small"
            clearable
          >
            <el-option :label="$t('admin.filters.all')" value="" />
            <el-option label="Silver" value="silver" />
            <el-option label="Gold" value="gold" />
            <el-option label="Platinum" value="platinum" />
          </el-select>
          <el-select
            v-model="filters.sort"
            placeholder="Urutkan"
            class="w-40"
            size="small"
          >
            <el-option :label="$t('admin.filters.newest')" value="newest" />
            <el-option :label="$t('admin.filters.oldest')" value="oldest" />
            <el-option :label="$t('admin.filters.nameAsc')" value="name_asc" />
            <el-option
              :label="$t('admin.filters.nameDesc')"
              value="name_desc"
            />
          </el-select>
        </div>
      </form>
    </div>

    <!-- Members Table -->
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
            <div class="h-10 w-10 rounded-full bg-gray-200" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/4" />
              <div class="h-3 bg-gray-200 rounded w-1/3" />
            </div>
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-6 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="members.length === 0" class="text-center py-16">
        <Icon
          name="material-symbols:people"
          class="text-4xl text-gray-300 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          {{ $t("admin.members.empty") }}
        </h3>
        <p class="text-gray-500 mb-4">{{ $t("admin.members.emptyDesc") }}</p>
        <Trubutton
          :text="$t('admin.members.addFirst')"
          type="primary"
          variant="solid"
          icon="material-symbols:person-add"
          @click="openCreate"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.member") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.email") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.phone") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.company") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.level") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.status") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ $t("admin.table.joined") }}
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
              v-for="member in members"
              :key="member.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium"
                  >
                    {{ member.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ member.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ member.email }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ member.phone }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ member.Company || "-" }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getLevelClass(member.level)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ member.level }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="
                    member.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{
                    member.status === "active"
                      ? $t("admin.active")
                      : $t("admin.inactive")
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(member.datejoin) }}
              </td>
              <td class="px-6 py-4 text-right w-32">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openDetail(member)"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="$t('admin.table.view')"
                  >
                    <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  </button>
                  <button
                    @click="openEdit(member)"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="$t('admin.table.edit')"
                  >
                    <Icon name="material-symbols:edit" class="h-4 w-4" />
                  </button>
                  <button
                    @click="toggleStatus(member)"
                    class="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg"
                    :title="member.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'"
                  >
                    <Icon
                      :name="
                        member.status === 'active'
                          ? 'material-symbols:block'
                          : 'material-symbols:check-circle'
                      "
                      class="h-4 w-4"
                    />
                  </button>
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
          @update:current-page="currentPage = $event"
        />
      </div>
    </div>

    <!-- Detail Modal -->
    <el-dialog
      v-model="detailVisible"
      :title="$t('admin.members.detail')"
      width="min(600px, 94vw)"
    >
      <template v-if="detailMember">
        <div class="flex items-center gap-4 mb-6">
          <div
            class="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-semibold"
          >
            {{ detailMember.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-900">
              {{ detailMember.name }}
            </p>
            <p class="text-sm text-gray-500">ID: {{ detailMember.id }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span
                :class="getLevelClass(detailMember.level)"
                class="px-2 py-0.5 text-xs font-medium rounded-full"
              >
                {{ detailMember.level || "-" }}
              </span>
              <span
                :class="
                  detailMember.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 py-0.5 text-xs font-medium rounded-full"
              >
                {{
                  detailMember.status === "active"
                    ? $t("admin.active")
                    : $t("admin.inactive")
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-6 text-sm">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">
              {{ $t("admin.members.personalInfo") }}
            </h4>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <dt class="text-gray-500">{{ $t("admin.table.email") }}</dt>
                <dd class="text-gray-900">{{ detailMember.email }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">{{ $t("admin.table.phone") }}</dt>
                <dd class="text-gray-900">{{ detailMember.phone || "-" }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">{{ $t("admin.table.joined") }}</dt>
                <dd class="text-gray-900">
                  {{ formatDate(detailMember.datejoin) }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">{{ $t("admin.members.point") }}</dt>
                <dd class="text-gray-900">{{ detailMember.point ?? "-" }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">
              {{ $t("admin.members.companyInfo") }}
            </h4>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <dt class="text-gray-500">{{ $t("admin.table.company") }}</dt>
                <dd class="text-gray-900">{{ detailMember.Company || "-" }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">{{ $t("admin.members.position") }}</dt>
                <dd class="text-gray-900">
                  {{ detailMember.position || "-" }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">
                  {{ $t("admin.members.companyEmail") }}
                </dt>
                <dd class="text-gray-900">
                  {{ detailMember.company_email || "-" }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">
                  {{ $t("admin.members.companyPhone") }}
                </dt>
                <dd class="text-gray-900">
                  {{ detailMember.company_phone || "-" }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">
                  {{ $t("admin.members.companyField") }}
                </dt>
                <dd class="text-gray-900">
                  {{ detailMember.company_field || "-" }}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">
              {{ $t("admin.members.addressInfo") }}
            </h4>
            <dl class="grid grid-cols-1 gap-y-3">
              <div>
                <dt class="text-gray-500">{{ $t("admin.members.address") }}</dt>
                <dd class="text-gray-900">{{ detailMember.address || "-" }}</dd>
              </div>
              <div class="grid grid-cols-2 gap-x-6">
                <div>
                  <dt class="text-gray-500">
                    {{ $t("admin.members.province") }}
                  </dt>
                  <dd class="text-gray-900">
                    {{ detailMember.provice || "-" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500">{{ $t("admin.members.city") }}</dt>
                  <dd class="text-gray-900">
                    {{ detailMember.city || "-" }}
                  </dd>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-x-6">
                <div>
                  <dt class="text-gray-500">
                    {{ $t("admin.members.district") }}
                  </dt>
                  <dd class="text-gray-900">
                    {{ detailMember.districts || "-" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500">
                    {{ $t("admin.members.postalCode") }}
                  </dt>
                  <dd class="text-gray-900">
                    {{ detailMember.kodepos || "-" }}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </template>
      <template #footer>
        <Trubutton
          :text="$t('button.cancel')"
          type="info"
          variant="ghost"
          @click="detailVisible = false"
        />
      </template>
    </el-dialog>

    <!-- Member Form Modal (Create / Edit) -->
    <el-dialog
      v-model="formVisible"
      :title="$t(isCreate ? 'admin.members.addNew' : 'admin.members.edit')"
      width="min(1180px, 96vw)"
      top="4vh"
    >
      <el-form v-if="form" label-position="top">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <h4
              class="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide"
            >
              {{ $t("admin.members.personalInfo") }}
            </h4>
            <div class="space-y-0">
              <el-form-item :label="$t('admin.table.name')" class="!mb-4">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item :label="$t('admin.table.email')" class="!mb-4">
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item :label="$t('admin.table.phone')" class="!mb-4">
                <el-input v-model="form.phone" />
              </el-form-item>
              <el-form-item :label="$t('admin.table.level')" class="!mb-4">
                <el-select v-model="form.level" class="w-full">
                  <el-option label="Silver" value="silver" />
                  <el-option label="Gold" value="gold" />
                  <el-option label="Platinum" value="platinum" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('admin.table.status')" class="!mb-0">
                <el-select v-model="form.status" class="w-full">
                  <el-option :label="$t('admin.active')" value="active" />
                  <el-option :label="$t('admin.inactive')" value="unactive" />
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div>
            <h4
              class="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide"
            >
              {{ $t("admin.members.companyInfo") }}
            </h4>
            <div class="space-y-0">
              <el-form-item :label="$t('admin.table.company')" class="!mb-4">
                <el-input v-model="form.Company" />
              </el-form-item>
              <el-form-item :label="$t('admin.members.position')" class="!mb-4">
                <el-input v-model="form.position" />
              </el-form-item>
              <el-form-item
                :label="$t('admin.members.companyEmail')"
                class="!mb-4"
              >
                <el-input v-model="form.company_email" />
              </el-form-item>
              <el-form-item
                :label="$t('admin.members.companyPhone')"
                class="!mb-4"
              >
                <el-input v-model="form.company_phone" />
              </el-form-item>
              <el-form-item
                :label="$t('admin.members.companyField')"
                class="!mb-0"
              >
                <el-input v-model="form.company_field" />
              </el-form-item>
            </div>
          </div>

          <div>
            <h4
              class="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide"
            >
              {{ $t("admin.members.addressInfo") }}
            </h4>
            <el-form-item :label="$t('admin.members.address')" class="!mb-4">
              <el-input v-model="form.address" />
            </el-form-item>
            <div
              v-if="form.provice || form.city || form.districts"
              class="mb-3 p-3 bg-orange-50 rounded-lg border border-orange-200 text-sm text-gray-700"
            >
              <span class="font-medium text-orange-800">
                {{ $t("admin.members.currentAddress") }}:
              </span>
              {{
                [form.address, form.village, form.districts, form.city, form.provice, form.kodepos]
                  .filter(Boolean)
                  .join(", ")
              }}
            </div>
            <AddressSelect v-model="addressModel" />
          </div>
        </div>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useAdminStore } from "~/stores/admin";

definePageMeta({ layout: "admin" });

const router = useRouter();
const adminStore = useAdminStore();

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  Company: string;
  position: string;
  company_email: string;
  company_phone: string;
  company_field: string;
  address: string;
  provice: string;
  city: string;
  districts: string;
  village: string;
  kodepos: string;
  level: string;
  status: string;
  datejoin: string;
  point?: number;
}

const loading = ref(false);
const members = ref<Member[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const detailVisible = ref(false);
const detailMember = ref<Member | null>(null);
const formVisible = ref(false);
const isCreate = ref(false);
const saving = ref(false);
const form = ref<Partial<Member> | null>(null);
const addressModel = ref<Record<string, any>>({});

const openDetail = (member: Member) => {
  detailMember.value = member;
  detailVisible.value = true;
};

const normalize = (s: any) =>
  String(s || "")
    .trim()
    .toLowerCase();

const resolveAddress = async (member: Member) => {
  const {
    getProvinces,
    getRegencies,
    getDistricts,
    getVillages,
  } = useAddress();
  const model: Record<string, any> = {
    province_id: "",
    regency_id: "",
    district_id: "",
    village_id: "",
    zipcode: member.kodepos || "",
    province: member.provice || "",
    regency: member.city || "",
    district: member.districts || "",
    village: member.village || "",
  };
  try {
    const provinces = await getProvinces();
    const province = provinces.find(
      (p: any) => normalize(p.name) === normalize(member.provice)
    );
    if (province) {
      model.province_id = String(province.id);
      model.province = province.name;
      const regencies = await getRegencies(province.id);
      const regency = regencies.find(
        (r: any) => normalize(r.name) === normalize(member.city)
      );
      if (regency) {
        model.regency_id = String(regency.id);
        model.regency = regency.name;
        const districts = await getDistricts(regency.id);
        const district = districts.find(
          (d: any) => normalize(d.name) === normalize(member.districts)
        );
        if (district) {
          model.district_id = String(district.id);
          model.district = district.name;
          const villages = await getVillages(district.id);
          const village = villages.find(
            (v: any) => normalize(v.name) === normalize(member.village)
          );
          if (village) {
            model.village_id = String(village.id);
            model.village = village.name;
          }
        }
      }
    }
  } catch {
    // names fallback kept
  }
  return model;
};

const openCreate = () => {
  form.value = {
    name: "",
    email: "",
    phone: "",
    Company: "",
    position: "",
    company_email: "",
    company_phone: "",
    company_field: "",
    address: "",
    level: "silver",
    status: "active",
  };
  addressModel.value = {};
  isCreate.value = true;
  formVisible.value = true;
};

const openEdit = async (member: Member) => {
  form.value = { ...member };
  addressModel.value = {};
  isCreate.value = false;
  formVisible.value = true;
  addressModel.value = await resolveAddress(member);
};

const buildBody = () => {
  const f = form.value!;
  return {
    id: isCreate.value ? undefined : f.id,
    name: f.name,
    email: f.email,
    phone: f.phone,
    Company: f.Company,
    position: f.position,
    company_email: f.company_email,
    company_phone: f.company_phone,
    company_field: f.company_field,
    address: f.address,
    provice: addressModel.value.province,
    city: addressModel.value.regency,
    districts: addressModel.value.district,
    village: addressModel.value.village,
    kodepos: addressModel.value.zipcode,
    level: f.level,
    status: f.status,
  };
};

const saveForm = async () => {
  if (!form.value) return;
  saving.value = true;
  try {
    const config = useRuntimeConfig();
    const body = buildBody();
    const response = await $fetch<{
      status: boolean;
      message: string;
      data: Member;
    }>(`${config.public.baseURL}/member/create`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${adminStore.token}`,
        "Content-Type": "application/json",
      },
    });
    const updated = response.data;
    if (isCreate.value) {
      members.value.unshift(updated);
      totalItems.value += 1;
      ElMessage.success(response.message || "Member berhasil ditambahkan");
    } else {
      const index = members.value.findIndex((m) => m.id === updated.id);
      if (index !== -1) {
        members.value[index] = updated;
      }
      if (detailMember.value?.id === updated.id) {
        detailMember.value = updated;
      }
      ElMessage.success(response.message || "Member berhasil diperbarui");
    }
    formVisible.value = false;
  } catch (e: any) {
    ElMessage.error(
      e.data?.message || (isCreate.value ? "Gagal menambahkan member" : "Gagal memperbarui member")
    );
  } finally {
    saving.value = false;
  }
};

const filters = ref({
  search: "",
  status: "",
  level: "",
  sort: "newest",
});

const applyFilters = () => {
  currentPage.value = 1;
  fetchMembers();
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    const config = useRuntimeConfig();
    const body: Record<string, string> = {};
    if (filters.value.search) body.name = filters.value.search;
    if (filters.value.status) body.status = filters.value.status;
    if (filters.value.level) body.level = filters.value.level;

    const response = await $fetch<{
      status: boolean;
      message: string;
      payload: {
        currentPage: number;
        total_page: number;
        total_data: number;
        query: any[];
      };
    }>(`${config.public.baseURL}/member/read?page=${currentPage.value}`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${adminStore.token}`,
        "Content-Type": "application/json",
      },
    });

    let list = (response.payload?.query || []) as Member[];
    switch (filters.value.sort) {
      case "oldest":
        list = [...list].sort((a, b) => a.datejoin.localeCompare(b.datejoin));
        break;
      case "name_asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        list = [...list].sort((a, b) => b.datejoin.localeCompare(a.datejoin));
    }

    totalItems.value = response.payload?.total_data || 0;
    totalPages.value = response.payload?.total_page || 1;
    members.value = list;
  } catch (e: any) {
    ElMessage.error("Gagal memuat data member");
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (member: any) => {
  try {
    await new Promise((r) => setTimeout(r, 500));
    member.status = member.status === "active" ? "unactive" : "active";
    ElMessage.success(
      `Member ${member.status === "active" ? "diaktifkan" : "dinonaktifkan"}`
    );
  } catch {
    ElMessage.error("Gagal mengubah status");
  }
};

const getLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    silver: "bg-gray-100 text-gray-800",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800",
  };
  return classes[level] || "bg-gray-100 text-gray-800";
};

const formatDate = (date: string) => {
  if (!date) return "-";
  const match = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (match) {
    const d = new Date(
      Number(match[3]),
      Number(match[2]) - 1,
      Number(match[1])
    );
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  fetchMembers();
});

watch(
  () => [
    filters.value.search,
    filters.value.status,
    filters.value.level,
    filters.value.sort,
  ],
  () => {
    currentPage.value = 1;
    fetchMembers();
  },
  { deep: true }
);

watch(
  () => currentPage.value,
  () => {
    fetchMembers();
  }
);
</script>
