import { applyDecorators } from "@nestjs/common";
import { IsStrongPassword } from "class-validator";
import {
  minLowercase,
  minLength,
  minSymbols,
  minUppercase,
  minNumbers,
} from "src/common/constants/password.constants";

export default function CheckPasswordConstraints(): any {
  return applyDecorators(
    IsStrongPassword({
      minLength,
      minLowercase,
      minNumbers,
      minSymbols,
      minUppercase,
    })
  );
}
