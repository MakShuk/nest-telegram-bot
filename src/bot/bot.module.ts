import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { AxiosService } from 'src/services/axios/axios.service';
import { LoggerService } from 'src/services/logger/logger.service';
import { PostsService } from 'src/posts/posts.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
	controllers: [BotController],
	providers: [
		BotService,
		AxiosService,
		PostsService,
		{
			provide: LoggerService,
			useValue: new LoggerService('bot'),
		},
	],
	imports: [PostsModule],
})
export class BotModule {}
