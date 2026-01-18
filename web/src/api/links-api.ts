import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CreateLinkDTO,
  Link,
} from '@/types';
import api from './api';

export type FetchLinksResponse = ApiSuccessResponse<{ links: Link[] }>;
export type FetchLinkByShortCodeResponse = ApiSuccessResponse<{ link: Link }>;
export type ExportLinksResponse = ApiSuccessResponse<{ report_url: string }>;
export type CreateLinkResponse = ApiSuccessResponse<{ link: Link }>;
export type DeleteLinkResponse = ApiSuccessResponse<object>;

export const fetchLinks = () =>
  api
    .get<FetchLinksResponse>('/links')
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: error.response?.data?.error,
      } as ApiErrorResponse;
    });

export const fetchLinkByShortCode = (shortCode: string) =>
  api
    .get<FetchLinkByShortCodeResponse>(`/links/${shortCode}`)
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: error.response?.data?.error,
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
        error: error.response?.data?.error,
      } as ApiErrorResponse;
    });

export const exportLinks = () =>
  api
    .get<ExportLinksResponse>('/links/export')
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: error.response?.data?.error,
      } as ApiErrorResponse;
    });

export const createLink = (data: CreateLinkDTO) =>
  api
    .post<CreateLinkResponse>('/links', data)
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: error.response?.data?.error,
      } as ApiErrorResponse;
    });

export const deleteLink = (shortCode: string) =>
  api
    .delete<DeleteLinkResponse>(`/links/${shortCode}`)
    .then(res => res.data)
    .catch(error => {
      return {
        success: false,
        error: error.response?.data?.error,
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
          error: { message: 'Mock error', type: 'Mock error' },
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
