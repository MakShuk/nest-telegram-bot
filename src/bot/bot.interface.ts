export interface IPost {
	id: number;
	title: string;
	originalTitle: string;
	content: string[];
	ratio: number;
	published: boolean;
	resourceId: number;
	imageUrl: string;
	imagePath: string;
	originalUrl: string;
	summaryUrl: string;
	updatedAt: Date;
}

export interface IPostResponce {
	content: string;
	error: boolean;
	data?: IPost[];
}
