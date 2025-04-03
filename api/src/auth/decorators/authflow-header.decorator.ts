import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { AuthFlowHeaderName } from "../constants";

export default function AuthFlowHeader(): any {
  return applyDecorators(
    ApiHeader({
      name: AuthFlowHeaderName,
      description:
        "The authentication flow to use. 'web' should be specified for web applications",
      required: false,
    })
  );
}
