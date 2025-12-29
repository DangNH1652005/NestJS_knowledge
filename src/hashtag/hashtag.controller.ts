import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService) {}

    @Post()
    public createNewHashtag(@Body() createhashtagDto: CreateHashtagDto) {
        return this.hashtagService.createHashtag(createhashtagDto);
    }

    @Delete(':id')
    public deleteHashtag(@Param('id', ParseIntPipe) id: number) {
        return this.hashtagService.deleteHashtag(id);
    }

    @Delete('soft-delete/:id')
    public softDeleteHashtag(@Param('id', ParseIntPipe) id: number) {
        return this.hashtagService.softDeleteHashtag(id);
    }
}
