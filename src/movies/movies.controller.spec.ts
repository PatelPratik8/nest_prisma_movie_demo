import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { HttpException, HttpStatus, INestApplication } from "@nestjs/common";
import { CreateMoviesDto, searchAllFilterDTo } from "./dto/movies.dto";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

describe("MoviesController", () => {
  let controller: MoviesController;
  let service: MoviesService;

  const createMovieDto: CreateMoviesDto = {
    name: "TestMovie",
    genre: "Action",
    rating: 4,
    release_date: new Date("1/1/2024"),
  };

  const mockMovie = {
    name: "TestMovie",
    genre: "Action",
    rating: 4,
    id: 1,
    release_date: new Date("1/1/2024"),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
  };

  const moviesRes = {
    massage: "create successfully",
    data: mockMovie,
    statusCode: HttpStatus.OK,
  };
  const movieArray = [
    {
      name: "TestMovie1",
      genre: "Action",
      rating: 4,
      
    id: 1,
    release_date: new Date("1/1/2024"),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
    },
    {
      name: "TestMovie",
      genre: "Action",
      rating: 4,
      
    id: 1,
    release_date: new Date("1/1/2024"),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
    },
  ];
  const filter: searchAllFilterDTo = { limit: 10, skip: 0 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn().mockResolvedValue(createMovieDto),
            update: jest.fn(),
            searchAll: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  describe("create()", () => {
    it("should create a new movie", async () => {
      const createSpy = jest
        .spyOn(service, "create")
        .mockResolvedValueOnce(mockMovie);

      const result = await controller.create(createMovieDto);
      // expect(service.create).toHaveBeenCalledWith(moviesRes);
      expect(result.massage).toEqual("create successfully");
      expect(result.statusCode).toEqual(200)

    });
  });

  describe("update()", () => {
    it("should update movie", async () => {
      const mockUpdateMoviesDto = {
        name: "UpdatedMovie",
        genre: "Drama",
        rating: 5,
        id: 1,
        created_at: new Date(),
        release_date: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      };

      const mockResult = {
        massage: "update successfully",
        data: mockUpdateMoviesDto,
        statusCode: HttpStatus.OK,
      };

      jest.spyOn(service, "update").mockResolvedValueOnce(mockUpdateMoviesDto);

      const result = await controller.update(mockUpdateMoviesDto, 1);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateMoviesDto);
      expect(result.massage).toEqual("update successfully");
      expect(result.statusCode).toEqual(200)

    });
    });


    describe("findAll()", () => {
      it("should find all the movies", async () => {
        jest.spyOn(service, "findAll").mockResolvedValueOnce([movieArray, 2]);
        const result = await controller.findAll(filter);
              
        expect(result.message).toEqual("List")
        expect(result.data).toBeDefined()
      });
    });

    describe("findOne()", () => {
      it("should return movie by id", async () => {
        jest.spyOn(service, "findOne").mockResolvedValueOnce(mockMovie);
        const result = await controller.findOne(1);
        expect(result.message).toEqual("Movie Information");
        expect(result.data).toBeDefined();
        expect(service.findOne).toHaveBeenCalledWith(1);
      });

      it("should throw error movie not found", async () => {
        jest.spyOn(service, "findOne").mockResolvedValueOnce(null);
        await expect(controller.findOne(5)).rejects.toThrow(
          new HttpException("movies not found.", HttpStatus.NOT_FOUND)
        );
      });
    });

    describe("delete()", () => {
      it("should delete the movie by id", async () => {
        const deleteResult = {
          acknowledged: true,
          deletedCount: 1,
        };
        jest.spyOn(service, "delete").mockResolvedValueOnce(mockMovie);
        const result = await controller.delete(1);
        expect(result.massage).toEqual("movie delete successfully");
        expect(service.delete).toHaveBeenCalledWith(1);
      });
    });

    // it("should throw error movie not found in delete", async () => {
    //   const deleteResult = {
    //     acknowledged: true,
    //     deletedCount: 0,
    //   };
    //   jest.spyOn(service, "delete").mockResolvedValueOnce(deleteResult);
    //   await expect(controller.delete("a id")).rejects.toThrow(
    //     new HttpException("movies not found.", HttpStatus.NOT_FOUND)
    //   );
  // });
});
