import {
	Update,
	Ctx,
	Start,
	Help,
	Hears,
	On,
	Cashtag,
	Command,
	InjectBot,
	Email,
} from 'nestjs-telegraf';
import { Telegraf, Context as TelegrafContext } from 'telegraf';

@Update()
export class BotUpdate {
	constructor(@InjectBot() private bot: Telegraf<TelegrafContext>) {}
	@Start()
	async start(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Welcome');
	}

	@Hears('Привет')
	handleGreeting(ctx: TelegrafContext) {
		ctx.reply('Здравствуйте! Как я могу вам помочь?');
	}

	@Email(/.*@company\.com/)
	async support(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Ма отприм настроки на support@company.com');
	}

	@Help()
	async help(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Send me a sticker');
	}

	@Command('new')
	async new(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('👌');
	}

	@On('text')
	async on(@Ctx() ctx: TelegrafContext) {
		console.log(ctx.message);
		if (ctx.message && 'text' in ctx.message) {
			ctx.message.text.includes('spam') ? await ctx.reply('No Spam') : await ctx.reply('OK');
		}
	}

	@Hears('hi')
	async hears(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Hey there');
		console.log(this.bot);
	}

	@Cashtag('$AAPL')
	async apple(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Вы упомянули акцию Apple!');
	}
}
