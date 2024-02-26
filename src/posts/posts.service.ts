import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ResponseData } from './posts.interface';

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}

	async findLastPosts(limit = 50): Promise<ResponseData<Post[]>> {
		try {
			const lastPosts = await this.prisma.post.findMany({
				orderBy: { id: 'desc' },
				take: limit,
			});
			return {
				content: `get last ${limit} posts`,
				error: false,
				data: lastPosts,
			};
		} catch (error) {
			return { content: `get last post error: ${error}`, error: true };
		}
	}

	async savePostsId(postIds: number[]): Promise<ResponseData<Post[]>> {
		try {
			for (const postId of postIds) {
				await this.prisma.post.create({
					data: {
						post_id: postId,
					},
				});
			}
			return {
				content: 'id added to db',
				error: false,
			};
		} catch (error) {
			return { content: `error add id: ${error}`, error: true };
		}
	}

	async checkPostId(postId: number) {
		try {
			const post = await this.prisma.post.findUnique({
				where: {
					post_id: postId,
				},
			});
			if (post) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error(`Error checking post ID: ${error}`);
			return false;
		}
	}
}
