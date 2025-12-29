import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';

// Using Pagination Query Provider
@Injectable()
export class PaginationProvider {
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>
    ) {

        const findOptions: FindManyOptions<T> = {
            skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit, // pagination
            take: paginationQueryDto.limit, // (page - 1) * limit
        }

        if(where) {
            findOptions.where = where;
        }

        const result = await repository.find(findOptions);

        const totalItems = await repository.count(); // nen them where
        const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);
        const currentPage = paginationQueryDto.page;
        const nextPage = paginationQueryDto.page === totalPages ? paginationQueryDto.page : paginationQueryDto.page + 1;
        const prevPage = paginationQueryDto.page === 1 ? paginationQueryDto.page : paginationQueryDto.page - 1;

        const response = {
            data: result,
            meta: {
                itemsPerPage: paginationQueryDto.limit,
                totalItems: totalItems,
                currentPage: paginationQueryDto.page,
                totalPages: totalPages
            },
            links: {

            }
        }   

        return result;
    }
}
