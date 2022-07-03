interface RequestOptions<T> {
  url: string;
  data?: T;
  method: string;
}
export const API_BASE = '/api/v1';

export const request = <T>(params: RequestOptions<T>) => fetch(`${API_BASE}${params.url}`, {
  method: params.method,
  body: params.data ? JSON.stringify(params.data) : null,
});