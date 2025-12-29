import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfileController } from './profile.controller';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService],
    imports: [TypeOrmModule.forFeature([Profile])]
})
export class ProfileModule {
}
