import { SerializeOptions, Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    SerializeOptions({ type: undefined }),
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
            },
            required: ["data"],
          },
          {
            properties: {
              meta: {
                type: "object",
                properties: {
                  items: { type: "number" },
                  hasNextPage: { type: "boolean" },
                  currentPage: { type: "number" },
                  totalItems: { type: "number" },
                  totalPages: { type: "number" },
                },
                required: [
                  "items",
                  "hasNextPage",
                  "currentPage",
                  "totalItems",
                  "totalPages",
                ],
              },
            },
            required: ["meta"],
          },
        ],
      },
    })
  );
};
