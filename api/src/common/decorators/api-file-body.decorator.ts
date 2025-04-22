import { applyDecorators } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

export const ApiFileBody = () => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: "object",
        properties: {
          file: {
            type: "string",
            format: "binary",
          },
        },
      },
    })
  );
};
