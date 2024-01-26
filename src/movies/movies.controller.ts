import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import {
  CreateMoviesDto,
  MoviesObj,
  PaginateResponse,
  findAllFilterDTo,
  searchAllFilterDTo,
} from "./dto/movies.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { AuthGuard } from "@app/auth/auth.guard";
import { RolesGuard } from "@app/auth/role.guard";
import { Roles } from "@app/auth/decorators/role.decorator";
import { UserRole } from "@app/auth/schemas/user.schema";
import { paginateResponse } from "@app/helper/commonFun";

@ApiTags("movies")
@ApiBearerAuth()
@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: MoviesObj, description: "movies created" })
  async create(@Body() createMoviesDto: CreateMoviesDto): Promise<any> {
    const result = await this.moviesService.create(createMoviesDto);
    return {
      massage: "create successfully",
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Put(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Body() updateMoviesDto: CreateMoviesDto,
    @Param("id", ParseIntPipe) id: number
  ) {
    const result = await this.moviesService.update(id, updateMoviesDto);
    if (!result)
      throw new HttpException("movies not found.", HttpStatus.NOT_FOUND);
    return {
      massage: "update successfully",
      data: {},
      statusCode: HttpStatus.OK,
    };
  }

  @Get("search")
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchAll(
    @Query() filter: searchAllFilterDTo
  ): Promise<PaginateResponse> {
    const data = await this.moviesService.searchAll(filter);
    return paginateResponse(data, filter.limit);
  }

  @Get()
  @CacheKey("moviesList")
  @UseInterceptors(CacheInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: findAllFilterDTo): Promise<PaginateResponse> {
    const data = await this.moviesService.findAll(filter);
    return paginateResponse(data, filter.limit);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<any> {
    const result = await this.moviesService.findOne(id);
    if (result)
      return {
        data: result,
        message: "Movie Information",
        statusCode: HttpStatus.OK,
      };
    throw new HttpException("movies not found.", HttpStatus.NOT_FOUND);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param("id", ParseIntPipe) id: number) {
    const result = await this.moviesService.delete(id);
    if (!result)
      throw new HttpException("movies not found.", HttpStatus.NOT_FOUND);
    return {
      massage: "movie delete successfully",
      data: {},
      statusCode: HttpStatus.OK,
    };
  }
}
