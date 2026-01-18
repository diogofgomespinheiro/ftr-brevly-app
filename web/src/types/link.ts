export type Link = {
  id: string;
  original_url: string;
  short_code: string;
  access_count: number;
  created_at: string;
  updated_at?: string;
};

export type CreateLinkDTO = {
  original_url: string;
  short_code: string;
};
