export function createTable(channelMap: {
  get: (id: string) => string | undefined;
  set: (id: string, name: string) => void;
}): { [key: string]: (event: any) => string } {
  return {
    channel_created: (event: any) => {
      channelMap.set(event.channel.id, event.channel.name);
      return `<@${event.channel.creator}> が #${event.channel.name} を作成しました（<#${event.channel.id}>）`;
    },
    channel_rename: (event: any) => {
      const oldName = channelMap.get(event.channel.id);
      channelMap.set(event.channel.id, event.channel.name);
      return `#${oldName} が #${event.channel.name} にリネームされました（<#${event.channel.id}>）`;
    },
    channel_archive: (event: any) =>
      `<@${event.user}> が #${channelMap.get(event.channel)} をアーカイブしました（<#${event.channel}>）`,
    channel_unarchive: (event: any) =>
      `<@${event.user}> が #${channelMap.get(event.channel)} をアンアーカイブしました（<#${event.channel}>）`,
    channel_deleted: (event: any) => `チャンネル #${channelMap.get(event.channel)} が削除されました`,
    channel_updated: (event: any) => `チャンネル #${channelMap.get(event.channel)} がプライベート化されました`,
    bot_added: (event: any) => `ボット <@${event.bot.id}> が追加されました`,
    team_join: (event: any) => `ワークスペースに <@${event.user.id}> が参加しました`,
    "emoji_changed::add": (event: any) => `絵文字追加 \`:${event.name}:\` :${event.name}:`,
    "emoji_changed::remove": (event: any) => `絵文字削除 ${event.names.map((name: string) => `:${name}:`).join(" ")}`,
  };
}
