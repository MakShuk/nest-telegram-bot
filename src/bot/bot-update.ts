import { Update, Ctx, Start, Command } from 'nestjs-telegraf';
import { Context as TelegrafContext } from 'telegraf';

@Update()
export class BotUpdate {
	constructor() {}
	@Start()
	async start(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('Welcome');
	}

	@Command('new')
	async new(@Ctx() ctx: TelegrafContext) {
		await ctx.reply('👌');
	}
}
