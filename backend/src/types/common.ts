// Kontrak bentuk response standar untuk semua endpoint

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta: ResponseMeta;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: ResponseMeta & { pagination: PaginationMeta };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  meta: ResponseMeta;
}
