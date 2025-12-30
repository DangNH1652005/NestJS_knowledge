import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import envValidation from './config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './auth/guards/authorize.guard';
import authConfig from './auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load Environment File Dynamically
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`, // undefined 
      load: [appConfig, databaseConfig],
      
      validationOptions: envValidation // Validating Environment Variables
    }),

    UsersModule, 
    TweetModule, 
    AuthModule, 

    TypeOrmModule.forRootAsync({  //  Asynchronous Connection 
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // entities: [User],
        autoLoadEntities: configService.get('database.autoloadEntities'),
        synchronize: configService.get('database.syncronize'),
        host: configService.get('database.host'),
        port: Number(configService.get('database.port')),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.dbName')
      })
    }), 

    ProfileModule, 
    HashtagModule, 
    PaginationModule,

    // ConfigModule.forFeature(authConfig),
    // JwtModule.registerAsync(authConfig.asProvider())
  ],

  controllers: [AppController],

  providers: [
    AppService, 
    // Guard Globally
    // {    
    //   provide: APP_GUARD,
    //   useClass: AuthorizeGuard
    // }
  ],
})
export class AppModule {}
