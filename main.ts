import autoResponses from "./auto_responses.json" with { type: "json" };
import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.20.3/mod.ts";

const bot = new Bot(Deno.env.get("TOKEN")!);

bot.on("message:text", async (ctx) => {
	const autoResponse = autoResponses.find((data) => data.trigger === ctx.message.text.toLowerCase());
	if (autoResponse) await ctx.reply(autoResponse.response);
});

async function handler(request): Promise<Response> {
	const url = new URL(request.url);
	switch(url.pathname) {
		case '/setwebhook': {
			await bot.api.setWebhook(url.origin);
			return new Response("200: OK")
			break;
		}
		default: {
			return webhookCallback(bot, "std/http")(request);
		}
	}
}

Deno.serve(handler);