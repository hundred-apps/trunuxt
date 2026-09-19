interface Region {
  id: string | number;
  name: string;
  province_id?: string | number;
  regency_id?: string | number;
  district_id?: string | number;
  kode_jne?: string;
}

interface AddressByVillage {
  village: string;
  district: string;
  regency: string;
  province: string;
  zipcode: string;
  village_id?: string | number;
  id?: string | number;
  [key: string]: any;
}

interface VillageSearchItem {
  label: string;
  value: string | number;
}

export function useAddress() {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL as string;

  async function getProvinces(): Promise<Region[]> {
    try {
      const res = await $fetch<Region[]>(`${baseURL}general/getwilayahprovince_json`);
      return res || [];
    } catch {
      return [];
    }
  }

  async function getRegencies(provinceId: string | number): Promise<Region[]> {
    try {
      const res = await $fetch<Region[]>(`${baseURL}general/getwilayahrigences_json`, {
        params: { id: provinceId },
      });
      return res || [];
    } catch {
      return [];
    }
  }

  async function getDistricts(regencyId: string | number): Promise<Region[]> {
    try {
      const res = await $fetch<Region[]>(`${baseURL}general/getwilayahdistricts_json`, {
        params: { id: regencyId },
      });
      return res || [];
    } catch {
      return [];
    }
  }

  async function getVillages(districtId: string | number): Promise<Region[]> {
    try {
      const res = await $fetch<Region[]>(`${baseURL}general/getwilayahvillages_json`, {
        params: { id: districtId },
      });
      return res || [];
    } catch {
      return [];
    }
  }

  async function getAddressByVillage(villageId: string | number): Promise<AddressByVillage | null> {
    try {
      const res = await $fetch<AddressByVillage>(`${baseURL}getjson/getAddressByVillage/${villageId}`);
      return res || null;
    } catch {
      return null;
    }
  }

  async function searchVillage(keyword: string): Promise<VillageSearchItem[]> {
    if (!keyword || keyword.length < 2) return [];
    try {
      const res = await $fetch<VillageSearchItem[]>(`${baseURL}getjson/villages`, {
        params: { keyword },
      });
      return res || [];
    } catch {
      return [];
    }
  }

  return {
    getProvinces,
    getRegencies,
    getDistricts,
    getVillages,
    getAddressByVillage,
    searchVillage,
  };
}
