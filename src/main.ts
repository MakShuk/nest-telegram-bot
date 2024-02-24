import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3004);
	console.log(`Nest-telegram-bot is running on: http://localhost:3004`);
}

bootstrap();
