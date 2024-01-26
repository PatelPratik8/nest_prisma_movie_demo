import { HttpStatus } from "@nestjs/common";

export function paginateResponse(
  data,
  limit
){
  const [result, total] = data;
  const totalPage = Math.ceil(total / limit);
  return {
    message: "List",
    data: result,
    count: total,
    totalPage: totalPage,
    limit: limit,
    statusCode: HttpStatus.OK,
  };
}
