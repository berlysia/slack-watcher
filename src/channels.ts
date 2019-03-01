import { WebClient } from "@slack/client";

const OPTION = {
  types: "public_channel,private_channel",
};

export function createChannelMap(client: WebClient) {
  const id2name = new Map<string, string>();
  const reset = async () => {
    const channels: { id: string; name: string }[] = [];
    let res = null,
      cursor: string | undefined;
    do {
      const nextOption: any = { ...OPTION };
      if (cursor) nextOption.cursor = cursor;

      res = await client.conversations.list(nextOption);
      channels.push(...(res as any).channels);
      cursor = res.response_metadata && res.response_metadata.next_cursor;
    } while (cursor);

    id2name.clear();
    for (const channel of channels) {
      id2name.set(channel.id, channel.name);
    }
  };

  const set = (id: string, name: string) => {
    id2name.set(id, name);
  };

  const get = (id: string) => id2name.get(id);

  return reset().then(() => ({
    reset,
    set,
    get,
  }));
}
