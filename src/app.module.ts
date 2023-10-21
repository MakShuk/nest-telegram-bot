import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { BotUpdate } from './bot/bot-update';
import { BotModule } from './bot/bot.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TelegrafModule.forRoot({
			token: process.env.TELEGRAM_BOT_TOKEN || 'NO BOT TOKEN',
		}),
		BotModule,
	],
	controllers: [AppController],
	providers: [AppService, BotUpdate],
})
export class AppModule {}
