import { config } from "dotenv";
import { main } from "./main";
config();

const token = process.env.SLACK_TOKEN!;
const channelId = process.env.CHANNEL_ID!;

main(token, channelId);
