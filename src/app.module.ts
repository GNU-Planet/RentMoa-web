import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DetachedHouseRent } from './entity/app.entity';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/client',
      rootPath: join(__dirname, '..', 'client'), // <-- path to the static files
    }),
    ConfigModule.forRoot({ envFilePath: '.env.dev' }), // Environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: 3306,
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: 'richJinju',
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([DetachedHouseRent]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
