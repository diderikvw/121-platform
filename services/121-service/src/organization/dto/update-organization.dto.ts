import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { LocalizedString } from '@121-service/src/shared/types/localized-string.type';

export class UpdateOrganizationDto {
  @ApiProperty({ example: 'NGO-name' })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({ example: { en: 'NGO display name' } })
  @IsOptional()
  public readonly displayName?: LocalizedString;
}
