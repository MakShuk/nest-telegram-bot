import { Body, Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { BotService } from './bot.service';
import cron from 'node-cron';

@Controller('bot')
export class BotController {
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
		cron.schedule('*/10 * * * *', async () => {
			const action = await this.botService.fullPostAction();
			console.log(action.content);
		});
	}
}
