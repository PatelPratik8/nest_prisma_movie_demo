import { ApiProperty } from "@nestjs/swagger";

export class SingUpDto {
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly password: string;
  }
  