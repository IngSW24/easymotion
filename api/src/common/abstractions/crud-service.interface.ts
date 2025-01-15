import { PaginatedOutput } from '../dto/paginated-output.dto';
import { PaginationFilter } from '../dto/pagination-filter.dto';

export interface CrudService<CreateDto, UpdateDto, Entity> {
  create(data: CreateDto): Promise<Entity>;
  findAll(pagination: PaginationFilter): Promise<PaginatedOutput<Entity>>;
  findOne(id: string): Promise<Entity>;
  update(id: string, data: UpdateDto): Promise<Entity>;
  remove(id: string): Promise<void>;
}
