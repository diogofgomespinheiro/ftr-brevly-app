import api from './api';
import type { ApiErrorResponse, ApiSuccessResponse } from './api.types';

export type Link = {
  id: string;
  original_url: string;
  short_code: string;
  access_count: number;
  created_at: string;
  updated_at?: string;
};

export type FetchLinksResponse = ApiSuccessResponse<{ links: Link[] }>;
export type FetchLinkByShortCodeResponse = ApiSuccessResponse<{ link: Link }>;
export type ExportLinksResponse = ApiSuccessResponse<{ report_url: string }>;

export const fetchLinks = () =>
  api
    .get<FetchLinksResponse>('/links')
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: { ...error.response.data.error, status: error.response.status },
      } as ApiErrorResponse;
    });

export const fetchLinkByShortCode = (shortCode: string) =>
  api
    .get<FetchLinkByShortCodeResponse>(`/links/${shortCode}`)
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: { ...error.response.data.error, status: error.response.status },
      } as ApiErrorResponse;
    });

export const incrementLinkAccessCount = (shortCode: string) =>
  api
    .patch<ApiSuccessResponse>(`/links/${shortCode}/increment`, null, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: { ...error.response.data.error, status: error.response.status },
      } as ApiErrorResponse;
    });

export const exportLinks = () =>
  api
    .get<ExportLinksResponse>('/links/export')
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: { ...error.response.data.error, status: error.response.status },
      } as ApiErrorResponse;
    });

const mockLinks = [
  {
    id: '1',
    original_url: 'https://example.com',
    short_code: 'abc123',
    access_count: 10,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    original_url: 'https://google.com',
    short_code: 'xyz789',
    access_count: 25,
    created_at: '2025-01-02T00:00:00Z',
  },
];

export const fetchLinksMock = (
  delay = 1000,
  shouldFail = false
): Promise<FetchLinksResponse | ApiErrorResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          success: false,
          error: { message: 'Mock error', type: 'Mock error', status: 500 },
        });
      } else {
        resolve({
          success: true,
          result: { links: mockLinks },
        });
      }
    }, delay);
  });
};
