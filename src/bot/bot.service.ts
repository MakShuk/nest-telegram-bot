import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { AxiosService } from 'src/services/axios/axios.service';
import { IPostResponce } from './bot.interface';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context as TelegrafContext } from 'telegraf';

type ImgMessageData = { title: string; content: string; originalUrl: string };

@Injectable()
export class BotService {
	constructor(
		private axios: AxiosService,
		private readonly postsService: PostsService,
		@InjectBot() private bot: Telegraf<TelegrafContext>,
	) {}

	async fullPostAction() {
		try {
			const chatId = process.env.CHAT_ID || 'NO ID';
			const getPostStatus = await this.getNewPost();
			if (getPostStatus.error || !getPostStatus.data) throw new Error(getPostStatus.content);

			const newId: number[] = [];

			for (const data of getPostStatus.data) {
				const { imageUrl, id, ...posts } = data;
				const sendMessageStatus = await this.sendImageToChat(chatId, imageUrl, posts);
				if (sendMessageStatus.error) continue;
				newId.push(id);
			}

			this.postsService.savePostsId(newId);

			return { content: `fullPostAcrion complite`, error: false };
		} catch (error) {
			return { content: `fullPostAcrion error: ${error}`, error: true };
		}
	}

	async getNewPost() {
		try {
			const url = 'http://localhost:3001/posts/last-50-posts';
			const lastId = await this.postsService.findLatstPosts();
			if (lastId.error || !lastId.data) throw new Error(lastId.content);

			const postIds = lastId.data.map(obj => obj.post_id);
			const responce: IPostResponce = await this.axios.req(url, []);
			if (responce.error || !responce.data) throw new Error(lastId.content);

			const filteredPosts = responce.data.filter(post => !postIds.includes(post.id));

			return { content: `Get new post`, error: false, data: filteredPosts };
		} catch (error) {
			return { content: `Get post: ${error}`, error: true };
		}
	}

	async sendImageToChat(chat_id: string | number, imgUrl: string, caption: ImgMessageData) {
		try {
			await this.bot.telegram.sendPhoto(chat_id, imgUrl, {
				caption: this.createFormatMessage(caption),
				parse_mode: 'HTML',
			});
			return { content: `img send to chat_id: ${chat_id}, imgUrl: ${imgUrl}`, error: false };
		} catch (e) {
			return {
				content: `chat_id: ${chat_id}, imgUrl: ${imgUrl} Error while message: ${e}`,
				error: true,
			};
		}
	}

	private createFormatMessage(post: ImgMessageData) {
		const { title, content, originalUrl } = post;
		const sentences = content.split('.');
		const resultList: string[] = sentences.map(sentence => {
			return `${sentence}`;
		});
		let sendMessage = `<b>${title}</b>
		`;

		for (const li of resultList) {
			if (li.trim() === '') continue;
			sendMessage += `
			 -${li}`;
		}

		sendMessage += `
		                              
		<a href="${originalUrl}">Подробнее</a>`;
		return sendMessage;
	}
}
