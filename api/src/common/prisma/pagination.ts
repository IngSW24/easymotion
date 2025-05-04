import { Prisma, PrismaClient } from "@prisma/client";
import { PaginatedOutput } from "../dto/paginated-output.dto";
import { PaginationFilter } from "../dto/pagination-filter.dto";
import { ClassConstructor, plainToInstance } from "class-transformer";

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

export type ExtendedPrismaService = ReturnType<typeof extendClient>;

export const extendClient = (client: PrismaClient) =>
  client.$extends(createPaginationExtension());

type TransformProps = {
  mapFn?: (item: any) => any;
  mapType?: ClassConstructor<unknown>;
};

const createPaginationExtension = () => {
  return {
    name: "pagination",
    model: {
      $allModels: {
        async paginate<T>(
          this: T,
          pagination: PaginationFilter,
          args: Prisma.Args<T, "findMany">,
          transform: TransformProps
        ): Promise<PaginatedOutput<any>> {
          const { page, perPage } = pagination;

          const findManyArgs: Prisma.Args<T, "findMany"> = {
            ...args,
            skip: page * perPage,
            take: perPage,
          };

          const context = Prisma.getExtensionContext(this);

          // Get the count with the same filters
          const countPromise = (context as any).count({
            where: findManyArgs.where,
          });

          // Get the paginated data
          const dataPromise = (context as any).findMany(findManyArgs);

          return Promise.all([countPromise, dataPromise]).then(
            ([count, data]) => {
              let transformedData = transform.mapType
                ? plainToInstance(transform.mapType, data, {
                    excludeExtraneousValues: true,
                  })
                : data;

              transformedData = transform.mapFn
                ? transformedData.map(transform.mapFn)
                : transformedData;

              return toPaginatedOutput(transformedData, count, pagination);
            }
          );
        },
      },
    },
  };
};
