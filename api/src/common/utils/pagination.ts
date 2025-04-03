import { PaginatedOutput } from "../dto/paginated-output.dto";
import { PaginationFilter } from "../dto/pagination-filter.dto";

export const toPaginatedOutput = <T>(
  data: T[],
  dbCount: number,
  pagination: PaginationFilter
): PaginatedOutput<T> => {
  return {
    data,
    meta: {
      currentPage: pagination.page,
      items: data.length,
      hasNextPage: (pagination.page + 1) * pagination.perPage < dbCount,
      totalItems: dbCount,
      totalPages: Math.ceil(dbCount / pagination.perPage),
    },
  };
};
