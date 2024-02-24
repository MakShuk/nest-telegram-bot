import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { AxiosService } from 'src/services/axios/axios.service';
import { IPostResponce } from './bot.interface';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context as TelegrafContext } from 'telegraf';

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
				const isSave = await this.postsService.checkPostId(data.id);
				if (isSave) {
					continue;
				}

				const { id, imageUrl, ...posts } = data;
				console.log(`Пост не сохранен ${data.id}`);

				const sendStatus = await this.sendMessageToChat(chatId, imageUrl, posts);

				if (sendStatus.error) {
					console.log(`Ошибка отправки сообщения ${sendStatus.content}`);
					continue;
				}
				console.log(`Пост ${id} title: ${posts.title} был успешно отправлен.`);
				newId.push(id);
			}

			this.postsService.savePostsId(newId);

			return { content: `fullPostAcrion завершено`, error: false };
		} catch (error) {
			return { content: `Ошибка fullPostAcrion: ${error}`, error: true };
		}
	}

	async getNewPost() {
		try {
			const limit = process.env.LIMIT_POSTS || 40;
			const baseUrl = process.env.BASE_URL;
			if (!baseUrl) throw new Error('No base url, check .env file');
			const url = `${baseUrl}?limit=${limit}`;
			const lastId = await this.postsService.findLatstPosts();
			if (lastId.error || !lastId.data) throw new Error(lastId.content);

			const postIds = lastId.data.map(obj => obj.post_id);
			const responce: IPostResponce = await this.axios.req({ url, data: [] });
			if (responce.error || !responce.data) throw new Error(lastId.content);

			const filteredPosts = responce.data.filter(post => !postIds.includes(post.id));

			return { content: `Get new post`, error: false, data: filteredPosts };
		} catch (error) {
			return { content: `Get post: ${error}`, error: true };
		}
	}

	async sendImageToChat(
		chat_id: string | number,
		imgUrl: string,
		caption: { title: string; content: string[]; originalUrl: string },
	) {
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

	private createFormatMessage(post: { title: string; content: string[]; originalUrl: string }) {
		const { title, content, originalUrl } = post;
		const formattedContent = content
			.filter(li => li.trim() !== '')
			.map(li => `  - ${li}`)
			.join('\n');
		const sendMessage = `<b>${title}</b>\n${formattedContent}\n<a href="${originalUrl}">Подробнее</a>`;
		console.log(sendMessage.length);
		return sendMessage;
	}

	async sendMessageToChat(
		chat_id: string | number,
		imageUrl: string,
		posts: { title: string; content: string[]; originalUrl: string },
	) {
		const sendMessageStatus = await this.sendImageToChat(chat_id, imageUrl, posts);
		if (sendMessageStatus.error) {
			if (sendMessageStatus.content.includes('message caption is too long') && posts.content.length > 1) {
				console.log('Сообщение слишком длинное');
				await this.sendImageToChat(chat_id, imageUrl, { ...posts, content: posts.content.slice(0, -1) });
			} else {
				return { content: `Ошибка отправки сообщения ${sendMessageStatus.content}`, error: true };
			}

			console.log(`Ошибка отправки сообщения ${sendMessageStatus.content}`);
		}

		return { content: `Сообщение отправлено ${posts.title}`, error: false };
	}
}
