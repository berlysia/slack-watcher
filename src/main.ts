import { RTMClient, WebClient } from "@slack/client";
import { createTable } from "./table";
import { createChannelMap } from "./channels";

const clientEvents = [
  "disconnected",
  "connecting",
  "authenticated",
  "connected",
  "ready",
  "disconnecting",
  "reconnecting",
  "error",
];

export async function main(token: string, channelId: string) {
  const rtm = new RTMClient(token);
  const web = new WebClient(token);

  const channelMap = await createChannelMap(web);
  const responseTable = createTable(channelMap);

  rtm.on("ready", async () => {
    await rtm.sendMessage(":eyes:", channelId);
  });

  rtm.on("message", async (message: any) => {
    // botと自分自身を無視
    if (
      (message.subtype && message.subtype === "bot_message") ||
      (!message.subtype && message.user === rtm.activeUserId)
    ) {
      return;
    }

    if (
      message.text
        .toLowerCase()
        .split(" ")
        .includes("ping")
    ) {
      await rtm.sendMessage("pong", message.channel);
    }
  });

  for (const [key, handler] of Object.entries(responseTable)) {
    rtm.on(key, (event: any) => {
      console.log(new Date(), key, event);
      rtm.sendMessage(handler(event), channelId);
    });
  }

  for (const key of clientEvents) {
    rtm.on(key, (...args: any[]) => {
      console.log(new Date(), key, ...args);
    });
  }

  rtm.start();
}
