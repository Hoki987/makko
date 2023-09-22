const WorkRoles = {
    Ban: "1154769569274150955",
}

const StuffRoles = {
    Admin: '1154731145552986112',
    Moderator: '1154731154025488434'
}

const Utility = {
    guildName: 'META',
    guildAvatar: 'https://cdn.discordapp.com/attachments/1129389401630314507/1154763833722802236/metaavatar.png'
}

const WorkEmbeds = {
    NotBanYourself: [
        {
            "title": "**Вы не можете забанить сами себя!**",
            "color": 16711680,
            "footer": {
                "text": `Сервер: ${Utility.guildName}`,
                "icon_url": `${Utility.guildAvatar}`
            }
        }
    ],
    NotBanBot: [
        {
            "title": "**Вы не можете забанить бота!**",
            "color": 16711680,
            "footer": {
                "text": `Сервер: ${Utility.guildName}`,
                "icon_url": `${Utility.guildAvatar}`
            }
        }
    ],
    NotBanRoleHigh: [
        {
            "title": "**Пользователь не был забанен!**",
            "description": "**Причина:** Позиция человека в стаффе выше, чем ваша.",
            "color": 16711680,
            "footer": {
                "text": `Сервер: ${Utility.guildName}`,
                "icon_url": `${Utility.guildAvatar}`
            }
        }
    ],
    NotBanRoleEquals: [
        {
            "title": "**Пользователь не был забанен!**",
            "description": "**Причина:** Позиция человека в стаффе равна вашей.",
            "color": 16711680,
            "footer": {
                "text": `Сервер: ${Utility.guildName}`,
                "icon_url": `${Utility.guildAvatar}`
            }
        }
    ],
    BanOk: [
        {
            "description": "**Пользователь был забанен**",
            "color": 7405312,
            "footer": {
                "text": `Сервер: ${Utility.guildName}`,
                "icon_url": `${Utility.guildAvatar}`
            }
        }
    ],
    BanNo: [
        {
            "title": "**Пользователь не был забанен!**",
            "description": "**Причина:** Пользователь уже в бане.",
            "color": 16711680,
            "footer": {
                "text": `Сервер: ${Utility.guildName}`,
                "icon_url": `${Utility.guildAvatar}`
            }
        }
    ],
}

module.exports = { WorkRoles, StuffRoles, WorkEmbeds };