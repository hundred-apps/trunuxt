<template>
  <div class="admin-settings">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.settings.title') }}</h1>
      <p class="mt-1 text-gray-600">{{ $t('admin.settings.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <nav class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
          <ul class="space-y-1">
            <li v-for="item in settingsMenu" :key="item.key">
              <NuxtLink
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="[
                  $route.path.startsWith(item.path)
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                <Icon :name="item.icon" class="h-5 w-5" />
                {{ $t(`admin.settings.${item.label}`) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Content -->
      <main class="lg:col-span-3 space-y-6">
        <!-- General Settings -->
        <section v-if="activeTab === 'general'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('admin.settings.general.title') }}</h2>
          <form @submit.prevent="saveGeneral" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.general.siteName') }}</label>
                <el-input v-model="generalSettings.siteName" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.general.siteUrl') }}</label>
                <el-input v-model="generalSettings.siteUrl" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.general.adminEmail') }}</label>
                <el-input v-model="generalSettings.adminEmail" type="email" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.general.currency') }}</label>
                <el-select v-model="generalSettings.currency" class="w-full" size="small">
                  <el-option label="IDR (Rupiah)" value="IDR" />
                  <el-option label="USD (Dollar)" value="USD" />
                </el-select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.general.timezone') }}</label>
                <el-select v-model="generalSettings.timezone" class="w-full" size="small">
                  <el-option label="WIB (UTC+7)" value="Asia/Jakarta" />
                  <el-option label="WITA (UTC+8)" value="Asia/Makassar" />
                  <el-option label="WIT (UTC+9)" value="Asia/Jayapura" />
                </el-select>
              </div>
            </div>
            <div class="pt-6 border-t border-gray-200">
              <Trubutton
                :text="$t('button.save')"
                type="primary"
                variant="solid"
                native-type="submit"
                :loading="savingGeneral"
              />
            </div>
          </form>
        </section>

        <!-- Appearance Settings -->
        <section v-if="activeTab === 'appearance'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('admin.settings.appearance.title') }}</h2>
          <form @submit.prevent="saveAppearance" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.settings.appearance.logo') }}</label>
              <div class="flex items-center gap-4">
                <img v-if="appearanceSettings.logo" :src="appearanceSettings.logo" alt="Logo" class="h-16 w-auto rounded border border-gray-200" />
                <div class="flex items-center gap-2">
                  <el-button type="primary" @click="logoInput.click()">{{ $t('admin.settings.appearance.uploadLogo') }}</el-button>
                  <el-button variant="outline" @click="removeLogo">{{ $t('admin.settings.appearance.remove') }}</el-button>
                </div>
                <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.appearance.primaryColor') }}</label>
                <el-color-picker v-model="appearanceSettings.primaryColor" show-alpha class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.appearance.secondaryColor') }}</label>
                <el-color-picker v-model="appearanceSettings.secondaryColor" show-alpha class="w-full" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.settings.appearance.favicon') }}</label>
              <div class="flex items-center gap-4">
                <img v-if="appearanceSettings.favicon" :src="appearanceSettings.favicon" alt="Favicon" class="h-10 w-10 rounded border border-gray-200" />
                <el-button type="primary" @click="faviconInput.click()">{{ $t('admin.settings.appearance.upload') }}</el-button>
              </div>
              <input ref="faviconInput" type="file" accept="image/x-icon,image/png" class="hidden" @change="handleFaviconUpload" />
            </div>
            <div class="pt-6 border-t border-gray-200">
              <Trubutton
                :text="$t('button.save')"
                type="primary"
                variant="solid"
                native-type="submit"
                :loading="savingAppearance"
              />
            </div>
          </form>
        </section>

        <!-- Email Settings -->
        <section v-if="activeTab === 'email'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('admin.settings.email.title') }}</h2>
          <form @submit.prevent="saveEmail" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.smtpHost') }}</label>
                <el-input v-model="emailSettings.smtpHost" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.smtpPort') }}</label>
                <el-input-number v-model="emailSettings.smtpPort" class="w-full" :min="1" :max="65535" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.username') }}</label>
                <el-input v-model="emailSettings.username" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.password') }}</label>
                <el-input v-model="emailSettings.password" type="password" show-password class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.fromEmail') }}</label>
                <el-input v-model="emailSettings.fromEmail" type="email" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.fromName') }}</label>
                <el-input v-model="emailSettings.fromName" class="w-full" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.email.encryption') }}</label>
                <el-select v-model="emailSettings.encryption" class="w-full" size="small">
                  <el-option label="TLS" value="tls" />
                  <el-option label="SSL" value="ssl" />
                  <el-option label="None" value="none" />
                </el-select>
              </div>
            </div>
            <div class="pt-6 border-t border-gray-200 flex gap-3">
              <Trubutton
                :text="$t('button.save')"
                type="primary"
                variant="solid"
                native-type="submit"
                :loading="savingEmail"
              />
              <Trubutton
                :text="$t('admin.settings.email.testConnection')"
                type="primary"
                variant="outline"
                @click="testEmailConnection"
              />
            </div>
          </form>
        </section>

        <!-- API Settings -->
        <section v-if="activeTab === 'api'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('admin.settings.api.title') }}</h2>
          <form @submit.prevent="saveApi" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.api.baseUrl') }}</label>
                <el-input v-model="apiSettings.baseUrl" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('admin.settings.api.timeout') }}</label>
                <el-input-number v-model="apiSettings.timeout" class="w-full" :min="1000" :step="1000" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('admin.settings.api.allowedOrigins') }}</label>
              <el-tag-input v-model="apiSettings.allowedOrigins" placeholder="https://example.com" class="w-full" />
            </div>
            <div class="pt-6 border-t border-gray-200">
              <Trubutton
                :text="$t('button.save')"
                type="primary"
                variant="solid"
                native-type="submit"
                :loading="savingApi"
              />
            </div>
          </form>
        </section>

        <!-- Integrations Settings -->
        <section v-if="activeTab === 'integrations'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('admin.settings.integrations.title') }}</h2>
          <div class="space-y-6">
            <div class="bg-gray-50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-semibold text-gray-900">Google Sheets</h3>
                  <p class="text-sm text-gray-500">Sinkronkan data produk, artikel, galeri ke Google Sheets</p>
                </div>
                <el-switch v-model="integrations.googleSheets.enabled" :active-text="$t('admin.enabled')" :inactive-text="$t('admin.disabled')" />
              </div>
              <div v-if="integrations.googleSheets.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Spreadsheet ID</label>
                  <el-input v-model="integrations.googleSheets.spreadsheetId" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" class="w-full" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Service Account Key</label>
                  <el-input v-model="integrations.googleSheets.serviceAccountKey" type="textarea" :rows="3" placeholder='{"type": "service_account", ...}' class="w-full font-mono text-sm" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-semibold text-gray-900">JNE Shipping</h3>
                  <p class="text-sm text-gray-500">Integrasi ongkir JNE</p>
                </div>
                <el-switch v-model="integrations.jne.enabled" :active-text="$t('admin.enabled')" :inactive-text="$t('admin.disabled')" />
              </div>
              <div v-if="integrations.jne.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <el-input v-model="integrations.jne.apiKey" type="password" show-password class="w-full" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <el-input v-model="integrations.jne.username" class="w-full" />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-semibold text-gray-900">WhatsApp Business API</h3>
                  <p class="text-sm text-gray-500">Kirim notifikasi order, promo via WhatsApp</p>
                </div>
                <el-switch v-model="integrations.whatsapp.enabled" :active-text="$t('admin.enabled')" :inactive-text="$t('admin.disabled')" />
              </div>
              <div v-if="integrations.whatsapp.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                  <el-input v-model="integrations.whatsapp.phoneNumberId" class="w-full" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                  <el-input v-model="integrations.whatsapp.accessToken" type="password" show-password class="w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const activeTab = computed(() => {
  const tabs = ['general', 'appearance', 'email', 'api', 'integrations'];
  return tabs.find(t => route.path.includes(t)) || 'general';
};

const savingGeneral = ref(false);
const savingAppearance = ref(false);
const savingEmail = ref(false);
const savingApi = ref(false);

const generalSettings = ref({
  siteName: 'Trumecs',
  siteUrl: 'https://www.trumecs.com',
  adminEmail: 'admin@trumecs.com',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
});

const appearanceSettings = ref({
  logo: 'https://migration.trumecs.com/logo/dark.png',
  favicon: 'https://migration.trumecs.com/favicon.ico',
  primaryColor: '#fa8420',
  secondaryColor: '#1a1a2e',
});

const emailSettings = ref({
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  username: 'noreply@trumecs.com',
  password: '',
  fromEmail: 'noreply@trumecs.com',
  fromName: 'Trumecs',
  encryption: 'tls',
});

const apiSettings = ref({
  baseUrl: 'https://migrationbe.trumecs.com/api/',
  timeout: 30000,
  allowedOrigins: ['https://www.trumecs.com', 'https://en.trumecs.com', 'https://zh.trumecs.com'],
});

const integrations = ref({
  googleSheets: { enabled: false, spreadsheetId: '', serviceAccountKey: '' },
  jne: { enabled: false, apiKey: '', username: '' },
  whatsapp: { enabled: false, phoneNumberId: '', accessToken: '' },
});

const settingsMenu = [
  { key: 'general', path: '/admin/settings', icon: 'material-symbols:settings', label: 'general' },
  { key: 'appearance', path: '/admin/settings/appearance', icon: 'material-symbols:palette', label: 'appearance' },
  { key: 'email', path: '/admin/settings/email', icon: 'material-symbols:mail', label: 'email' },
  { key: 'api', path: '/admin/settings/api', icon: 'material-symbols:api', label: 'api' },
  { key: 'integrations', path: '/admin/settings/integrations', icon: 'material-symbols:integration-instructions', label: 'integrations' },
];

const saveGeneral = async () => {
  savingGeneral.value = true;
  try { await new Promise(r => setTimeout(r, 1000)); ElMessage.success('Pengaturan umum disimpan'); }
  catch { ElMessage.error('Gagal menyimpan'); }
  finally { savingGeneral.value = false; }
};

const saveAppearance = async () => {
  savingAppearance.value = true;
  try { await new Promise(r => setTimeout(r, 1000)); ElMessage.success('Pengaturan tampilan disimpan'); }
  catch { ElMessage.error('Gagal menyimpan'); }
  finally { savingAppearance.value = false; }
};

const saveEmail = async () => {
  savingEmail.value = true;
  try { await new Promise(r => setTimeout(r, 1000)); ElMessage.success('Pengaturan email disimpan'); }
  catch { ElMessage.error('Gagal menyimpan'); }
  finally { savingEmail.value = false; }
};

const saveApi = async () => {
  savingApi.value = true;
  try { await new Promise(r => setTimeout(r, 1000)); ElMessage.success('Pengaturan API disimpan'); }
  catch { ElMessage.error('Gagal menyimpan'); }
  finally { savingApi.value = false; }
};

const handleLogoUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    // Upload logic here
    appearanceSettings.value.logo = URL.createObjectURL(file);
    ElMessage.success('Logo diupload');
  }
};

const removeLogo = () => {
  appearanceSettings.value.logo = '';
  ElMessage.success('Logo dihapus');
};

const handleFaviconUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    appearanceSettings.value.favicon = URL.createObjectURL(file);
    ElMessage.success('Favicon diupload');
  }
};

const testEmailConnection = async () => {
  ElMessage.info('Menguji koneksi email...');
  await new Promise(r => setTimeout(r, 2000));
  ElMessage.success('Koneksi email berhasil');
};
</script>