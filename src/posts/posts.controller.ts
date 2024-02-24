import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get('last-id')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async findLatstPosts() {
		const createPost = await this.postsService.findLatstPosts();
		if (createPost.error) {
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createPost.data;
	}

	@Get('new-id')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async saveNeWIds() {
		const testIds = [1, 3, 4];
		const createPost = await this.postsService.savePostsId(testIds);
		if (createPost.error) {
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createPost.data;
	}
}
