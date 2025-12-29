import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from './paginater.interface';


// Using Pagination Query Provider
@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request
    ) {
    }

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T> | null,
        relations?: string[]
    ): Promise<Paginated<T>> {

        const findOptions: FindManyOptions<T> = {
            skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit, // pagination
            take: paginationQueryDto.limit, // (page - 1) * limit
        }

        if(where) {
            findOptions.where = where;
        }

        if(relations) {
            findOptions.relations = relations;
        }

        const result = await repository.find(findOptions);

        const totalItems = await repository.count({ where: where ?? undefined }); // nen them where
        const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);
        const currentPage = paginationQueryDto.page;
        const nextPage = paginationQueryDto.page === totalPages ? paginationQueryDto.page : paginationQueryDto.page + 1;
        const prevPage = paginationQueryDto.page === 1 ? paginationQueryDto.page : paginationQueryDto.page - 1;

        const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/';
        const newUrl = new URL(this.request.url, baseUrl);
        console.log(newUrl);
        

        const response: Paginated<T> = {
            data: result,
            meta: {
                itemsPerPage: paginationQueryDto.limit,
                totalItems: totalItems,
                currentPage: paginationQueryDto.page,
                totalPages: totalPages
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,
                last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,
                current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${currentPage}`,
                next:  `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
                previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${prevPage}`
            }
        }   

        return response;
    }
}
