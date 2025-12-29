import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('tweet')
export class TweetController {
    constructor(private tweetService: TweetService){}

    // http://localhost:3000/tweet/101?limit=10&page=3
    @Get(':userId')
    public GetTweets(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() paginationQueryDto: PaginationQueryDto
    ) {
        return this.tweetService.getTweets(userId, paginationQueryDto);
    }

    @Post()
    public createTweet(@Body() tweet: CreateTweetDto) {
        return this.tweetService.createTweet(tweet);
    }

    @Patch()
    public updateTweet(@Body() tweet: UpdateTweetDto) {
        return this.tweetService.updateTweet(tweet);
    }

    @Delete(':id')
    public deleteTweet(@Param('id', ParseIntPipe) id: number) {
        return this.tweetService.deleteTweet(id);
    }
}
