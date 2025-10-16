export interface PageOfDto<DTO> {
  count: number;
  totalCount: number;
  page: number;
  totalPages: number;
  lastItemIndex: number;
  results: DTO[];
}
