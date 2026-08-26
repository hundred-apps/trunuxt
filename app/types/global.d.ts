declare global {
  type BaseResponse<T> = {
    status: boolean;
    message: string;
    meta?: {
      keyword: string;
      keywords: string[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    payload: T;
  };
}

export {};
