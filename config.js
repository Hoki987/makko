const OwnerId = {
    hoki: '297372127768870913'
}

const WorkRoles = {
    Ban: "865956684529926194",
    Pred: "936726245142573056",
    BanCam: "932423251819372595",
    BanJPG: "866625867577163776",
    Mute: "865956690070470656",
}

const UntilsRoles = {
    Everyone: "822354240713261068",
    Male: "840530290962071624",
    Female: "866020486378291220",
    Loveroom: "866386010891223040",
    Ban: "865956684529926194"
}

const StaffServerRoles = {
    Owner: '1104726172111212604',
    Bot: "1105461876109873183",
    FullAdmin: "1104726858920108074",
    Admin: '1104727857269321839',
    Developer: '1172521451161649172',
    Moderator: '1108887305273491556',
    Curator: '1126417393221107804',
    Control: '1104780755017682985',
    Assistant: '1104780755017682985',
    EventsMod: "1104927193479512205",
    MafiaBunkerMod: "1105499158636412959",
    CloseMod: "1105499310583447663",
    CreativeMod: "1104810378376007730",
    ContentMod: "1104774766277169162"
}

const StaffRoles = {
    Owner: "866632983427678219",
    Bot: "927175918936522803",
    FullAdmin: "841280413775298560",
    FakeAdmin: "955929692953800716",
    Admin: '865961562955317268',
    Developer: '866438519265951764',
    Moderator: '865961558991044629',
    Curator: '822526914321055744',
    Control: '842077390641561610',
    Assistant: '1139669836696387745',
    EventsMod: '865974246597066762',
    MafiaBunkerMod: '944556479405522984',
    CloseMod: '866366388117176320',
    CreativeMod: '957019679036158044',
    ContentMod: '1033705687047471124'
}

const StaffChats = {
    Control: '1188902802106359868',
    Assistant: '1188902908096422020',
    Logs: '867011000770756628',
    StaffServerLogs: "1186244264519274506",
    Obhod: '1188862460179009567',
    ObhodChat: '1188862393783160892',
    Appel: 'https://discord.com/channels/1000307645854519306/1177890571986141224'
}

const Reasons = {
    PERM: ['<13', 'переход', '3.9', '3.11'],
    HARD: ['3.1', '3.3', '3.6', '3.7', '3.10', '3.13'],
    SOFT: ['4.3'],
    ADMIN: ['4.4']
}

const Utility = {
    StuffServer: '1104726144697258044',
    guildId: '822354240713261068',
    colorRed: 16711680,
    colorGreen: 7405312,
    colorYellow: 16771840,
    colorDiscord: 2829617,

    CuratorControl: '1163407227638534217',
    CuratorAssist: '1163407187591299072',
    banEmoji: '<:ban:1163067435281301555>',
    pointEmoji: '<:tochka:1156615794923409488>',
    fonEmoji: '<:meta_fon:1103228292154282045>'
}

const HistoryEmojis = {
    Ban: "<:ban:1163067435281301555>",
    Pred: "<:pred:1163067430055194684>",
    BanCam: "<:bancam:1163067438456389692>",
    BanJPG: "<:banjpg:1163067440226373723>",
    Mute: "<:mute:1163067443246284800>",
    Warn: "<:warn:1163067431737106492>"
}

const HistoryNames = {
    Ban: "бан",
    Pred: "предупреждение",
    BanCam: "запрет камеры",
    BanJPG: "запрет картинок",
    Mute: "мут",
    Warn: "варн"
}

const PunishmentRemoveMessage = {
    Ban: "Вы были **разбанены**",
    Pred: "У вас было снято **предупреждение**",
    BanCam: "У вас был снят **запрет камеры**",
    BanJPG: "У вас был снят **запрет картинок**",
    Mute: "Время мута истекло, вы были **размучены**",
}

const CommandsLogsID = {
    Mute: '</mute:1170111146863370383>',
    Pred: '</pred:1170111146863370384>',
    Warn: '</warn:1170111146863370387>',
    BanJPG: '</banjpg:1170111146863370381>',
    BanCam: '</bancam:1170111146422964239>',
    Ban: '</ban:1170111146422964238>',
}

module.exports = { OwnerId, WorkRoles, StaffRoles, StaffServerRoles, Reasons, Utility, HistoryEmojis, StaffChats, UntilsRoles, CommandsLogsID, HistoryNames, PunishmentRemoveMessage };