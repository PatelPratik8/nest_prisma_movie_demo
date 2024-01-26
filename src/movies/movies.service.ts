import { Injectable } from "@nestjs/common";
import {
  CreateMoviesDto,
  findAllFilterDTo,
  searchAllFilterDTo,
} from "./dto/movies.dto";
import { DatabaseService } from "@app/database/database.service";
import { Movies, Prisma } from "@prisma/client";

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createMoviesDto: CreateMoviesDto): Promise<Movies> {
    const createdMovies = await this.prisma.movies.create({
      data: createMoviesDto,
    });
    return createdMovies;
  }

  async update(id: number, updateMoviesDto: CreateMoviesDto) {
    const movies = await this.prisma.movies.findFirst({ where: { id } });
    if (!movies) return null;
    const updateMovies = await this.prisma.movies.update({
      where: { id: id },
      data: updateMoviesDto,
    });
    return updateMovies;
  }
  async searchAll(queryData: searchAllFilterDTo): Promise<[Movies[], number]> {
    let filter = {};
    if (queryData.q)
      filter = { OR: [{ name: queryData.q }, { genre: queryData.q }] };
    const data = this.prisma.movies.findMany({
      where: filter,
      take: queryData.limit,
      skip: queryData.skip,
    });
    const count = this.prisma.movies.count({ where: filter });
    return Promise.all([data, count]);
  }

  async findAll(queryData: findAllFilterDTo): Promise<[Movies[], number]> {
    const filter = {};
    const data = this.prisma.movies.findMany({
      where: {},
      take: queryData.limit,
      skip: queryData.skip,
    });
    const count = this.prisma.movies.count({ where: filter });
    return Promise.all([data, count]);
  }

  async findOne(id: number): Promise<Movies | null> {
    return this.prisma.movies.findFirst({ where: { id: id } });
  }

  async delete(id: number) {
    const movies = await this.prisma.movies.findFirst({ where: { id } });
    if (!movies) return null;
    const deletedCat = await this.prisma.movies.delete({ where: { id } });
    return deletedCat;
  }
}
