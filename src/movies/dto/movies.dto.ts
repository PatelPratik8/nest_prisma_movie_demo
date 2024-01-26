import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class CreateMoviesDto {
  @ApiProperty()
  readonly name: string = "abc";
  @ApiProperty()
  readonly genre: string = "none";
  @ApiProperty()
  readonly rating: number = -1;
  @ApiProperty()
  readonly release_date: Date = new Date()
}

export class MoviesObj {
  // @ApiProperty()
  // _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  streamingLink: string;
}

export class findAllFilterDTo {
  @ApiPropertyOptional()
  limit?: number = 10;
  @ApiPropertyOptional()
  skip?: number = 0;
}

export class searchAllFilterDTo extends findAllFilterDTo {
  @ApiPropertyOptional()
  q?: string;
}

export class PaginateResponse{
  data: any
  count: number
  totalPage: number
  limit:number
  message:string
}