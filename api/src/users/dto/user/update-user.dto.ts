import { PartialType } from "@nestjs/swagger";
import { ApplicationUserDto } from "./application-user.dto";

export class UpdateUserDto extends PartialType(ApplicationUserDto) {}
