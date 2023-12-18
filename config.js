const OwnerId = {
    hoki: ''
}

const WorkRoles = {
    Ban: "1154769569274150955",
    Pred: "1159074943913435176",
    BanCam: "1159178709123743755",
    BanJPG: "1159431090814070794",
    Mute: "1166431117017104515",
}

const UntilsRoles = {
    Everyone: "1000307645854519306",
    Male: "1168099600213741578",
    Female: "1168099623425032313",
    Loveroom: "1168099628730818610",
    Ban: "1154769569274150955"
}

const StaffServerRoles = {
    Owner: '1083514931984482304',
    Admin: '1154731145552986112',
    Developer: '1163407094691680346',
    Moderator: '1154731154025488434',
    Curator: '1177911423540666389',
    Control: '1177523605073039380',
    Assistant: '1163407187591299072'
}

const OwnerRoles = {
    Admin: '1154731145552986112',
    Developer: '1163407094691680346',
    Moderator: '1154731154025488434',
}

const StaffRoles = {
    Admin: '1154731145552986112',
    Developer: '1163407094691680346',
    Moderator: '1154731154025488434',
    Curator: '1177911423540666389',
    Control: '1177523605073039380',
    Assistant: '1163407187591299072',
    EventsMod: '1163407206230798416',
    MafiaBunkerMod: '1163407227638534217',
    CloseMod: '1163407253307658271',
    CreativeMod: '1163407267085955072',
    ContentMod: '1163407285406674984'
}

const StaffChats = {
    Control: '1177899166215720960',
    Assistant: '1177899149576900718',
    Logs: '1177899443329192018',
    StaffServerLogs: "1186245205351989268",
    Obhod: '1177488648212590632',
    Appel: 'https://discord.com/channels/1000307645854519306/1177890571986141224'
}

const Reasons = {
    PERM: ['<13', 'переход', '3.9', '3.11'],
    HARD: ['3.1', '3.3', '3.6', '3.7', '3.10', '3.13'],
    SOFT: ['4.3'],
    ADMIN: ['4.4']
}

const Utility = {
    StuffServer: '1000307645854519306',
    guildId: '1000307645854519306',
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

module.exports = { OwnerId, WorkRoles, StaffRoles, StaffServerRoles, Reasons, Utility, HistoryEmojis, StaffChats, UntilsRoles, CommandsLogsID, OwnerRoles, HistoryNames, PunishmentRemoveMessage };