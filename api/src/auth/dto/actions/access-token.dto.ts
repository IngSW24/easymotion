import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    description: 'The access token',
  })
  @IsString()
  @Expose()
  accessToken: string;
}
