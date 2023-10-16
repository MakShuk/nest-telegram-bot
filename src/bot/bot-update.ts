import { Update, Ctx, Start, Help, Hears, On, Cashtag } from 'nestjs-telegraf';
import { Context as TelegrafContext } from 'telegraf';

@Update()
export class BotUpdate {
	@Start()
	async start(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Welcome');
	}

	@Help()
	async help(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Send me a sticker');
	}

	@On('sticker')
	async on(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('👍');
	}

	@Hears('hi')
	async hears(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Hey there');
	}

	@Cashtag('$AAPL')
	async apple(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Вы упомянули акцию Apple!');
	}
}
