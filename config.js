const WorkRoles = {
    Ban: "1149850510338310165",
}

const StuffRoles = {
    Admin: "1153982129357717544",
    Moderator: "1153982136404148325"
}

const WorkEmbeds = {
    NotBanRoleHigh: [
        {
            "title": "**Пользователь не был забанен!**",
            "description": "**Причина:** Позиция человека в стаффе выше, чем ваша.",
            "color": 16711680,
            "footer": {
              "text": "Сервер:"
            }
          }
    ]
}

module.exports = { WorkRoles, StuffRoles, WorkEmbeds };