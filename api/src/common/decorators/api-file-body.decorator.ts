import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

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
    }),
    ApiConsumes("multipart/form-data"),
    UseInterceptors(FileInterceptor("file"))
  );
};
