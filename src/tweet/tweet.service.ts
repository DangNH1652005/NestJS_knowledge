import { Injectable, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Tweet } from './tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';

@Injectable()
export class TweetService {
    constructor(
        // You should always inject one service into another service, do not inject other repository
        private readonly userService: UsersService,
        private readonly hashtagService: HashtagService,

        @InjectRepository(Tweet)
        private readonly tweetRepository: Repository<Tweet>,

        private readonly paginationProvider: PaginationProvider
    ) {}

    public async getTweets(userId: number, pageQueryDto: PaginationQueryDto) {
        let user = await this.userService.findUserById(userId);

        if(!user) {
            throw new NotFoundException('User with userId not found');
        }

        return await this.paginationProvider.paginateQuery(
            pageQueryDto,
            this.tweetRepository,
            { user: { id: userId } }
        )
    }

    public async createTweet(createTweetDto: CreateTweetDto) {
        let user = await this.userService.findUserById(createTweetDto.userId ) || null;

        if (!user) {
            throw new NotFoundException('User not found');
        }

        let hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags ?? []);

        let tweet = await this.tweetRepository.create({...createTweetDto, user, hashtags});
        
        return await this.tweetRepository.save(tweet);
    }

    public async updateTweet(updateTweetDto: UpdateTweetDto) {
        let hashtags = await this.hashtagService.findHashtags(updateTweetDto.hashtags || []);
        
        let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id });

        if (!tweet) {
            throw new NotFoundException('Tweet not found');
        }

        tweet.text = updateTweetDto.text ?? tweet.text;
        tweet.image = updateTweetDto.image ?? tweet.image;
        tweet.hashtags = hashtags;

        return await this.tweetRepository.save(tweet);
    }

    public async deleteTweet(id: number) {
        await this.tweetRepository.delete({ id });
        return { deleted: true, id }
    }
}
