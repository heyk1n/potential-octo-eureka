import autoResponses from "./auto_responses.json" with { type: "json" };
import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.20.3/mod.ts";

const bot = new Bot(Deno.env.get("TOKEN")!);

bot.on("message:text", async (ctx) => {
	const autoResponse = autoResponses.find((data) => data.trigger === ctx.message.text.toLowerCase());
	if (autoResponse) await ctx.reply(
		autoResponse.response,
		{
			reply_parameters: {
				message_id: ctx.message.message_id
			}
		}
	);
});

async function handler(request): Promise<Response> {
	const url = new URL(request.url);
	switch(request.method) {
		case 'GET': {
			await bot.api.setWebhook(url.origin);
			return new Response("200: OK")
			break;
		}
		case 'POST': {
			return webhookCallback(bot, "std/http")(request);
			break;
		}
		default: {
			return new Response("401: Unauthorized")
		}
	}
}

Deno.serve(handler);