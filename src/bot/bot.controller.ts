import { Body, Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { BotService } from './bot.service';
import cron from 'node-cron';
import { OnModuleInit } from '@nestjs/common';

@Controller('bot')
export class BotController implements OnModuleInit {
	onModuleInit() {
		this.cronAction();
	}
	constructor(private readonly botService: BotService) {}

	@Get('last-post')
	async findLatstPosts() {
		const createPost = await this.botService.getNewPost();
		if (createPost.error) {
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createPost.data;
	}

	@Get('send-img')
	async sendImageToChat(@Body() query: any) {
		const chat_id = process.env.CHAT_ID || 'NO ID';
		const { imageUrl, ...posts } = query;
		const createPost = await this.botService.sendImageToChat(chat_id, imageUrl, posts);
		if (createPost.error) {
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createPost.content;
	}

	@Get('full-post-action')
	async fullPostAction() {
		const action = await this.botService.fullPostAction();
		if (action.error) {
			throw new HttpException(`${action.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return action.content;
	}

	@Get('cron')
	async cronAction() {
		console.log('Задача Cron была запущена');
		cron.schedule('*/1 * * * *', async () => {
			const action = await this.botService.fullPostAction();
			console.log(action.content);
		});
	}
}
