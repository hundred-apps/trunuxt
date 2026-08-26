type RequestMethod = "post" | "put" | "get" | "delete";

interface FetchApiResult<T> {
  status: "success" | "error" | "idle";
  data: T | null;
  code: number | undefined;
}

export async function useFetchApi<T>(
  endpoint: string,
  _key: string,
  request_method: RequestMethod,
  body: any | null
): Promise<FetchApiResult<T>> {
  const config = useRuntimeConfig();

  try {
    const response = await $fetch<T>(
      `${config.public.baseURL}${endpoint}`,
      {
        method: request_method.toUpperCase() as any,
        body: body ?? undefined,
      }
    );
    return { status: "success", data: response, code: undefined };
  } catch (err: any) {
    const code = err?.statusCode || err?.status;
    if (code === 403 && import.meta.client) {
      ElMessage.error(
        err?.data?.message ?? "Action Not Permitted"
      );
    }
    return { status: "error", data: null, code };
  }
}
