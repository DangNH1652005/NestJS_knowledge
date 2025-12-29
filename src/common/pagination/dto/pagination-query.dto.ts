import { Type } from "class-transformer";
import { IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsPositive()
    @Type(() => Number)
    limit: number = 10;

    @IsPositive()
    @Type(() => Number)
    page: number = 1;
}