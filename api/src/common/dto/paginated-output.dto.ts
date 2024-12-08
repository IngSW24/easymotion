import { Expose, Type } from 'class-transformer';

@Expose()
class PaginatedOutputMetadata {
  @Expose()
  items: number;

  @Expose()
  hasNextPage: boolean;

  @Expose()
  currentPage: number;

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;
}

@Expose()
export class PaginatedOutput<T> {
  @Expose()
  @Type(() => Object)
  data: T[];

  @Expose()
  @Type(() => Object)
  meta: PaginatedOutputMetadata;
}
