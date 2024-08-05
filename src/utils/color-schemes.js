export const SCHEMES = {
    dark: {
        // Custom scheme
        name: "Dark",
        mode: "dark",
        // Secondary is the same as muted
        colors: {
            primary: "#5fa8d3", // 95, 168, 211
            secondary: "#737373", // 115, 115, 115
            body: "#e0e0e0", // 224, 224, 224
            bodyLight: "#e0e0e0", // 224, 224, 224
            bodyDark: "#1a1a1a", // 26, 26, 26
            background: "#191919", // 25, 25, 25
            backgroundNav: "#202020", // 32, 32, 32
            muted: "#737373", // 115, 115, 115
            menu: "#191919", // 25, 25, 25

            success: "#5bae70", // 91, 174, 112
            danger: "#d76363", // 215, 99, 99
            warning: "#d9a063", // 217, 160, 99
            info: "#63b1d9", // 99, 177, 217

            orange: "#fe9c66", // 254, 156, 102
            yellow: "#f2ce75", // 242, 206, 117
            green: "#a0cc71", // 160, 204, 113
            aqua: "#6ae9c1", // 106, 233, 193
            blue: "#8ed8de", // 142, 216, 222
            purple: "#a08ed5", // 160, 142, 213
            pink: "#e87090", // 232, 112, 144
            gray: "#636270", // 99, 98, 112
        },
    },
    kanagawa: {
        // https://github.com/rebelot/kanagawa.nvim
        name: "Kanagawa",
        mode: "dark",
        // Secondary is the same as muted
        colors: {
            primary: "#7e9cd8", // 126, 156, 216
            secondary: "#6f6f90", // 111, 111, 144
            body: "#dcd7ba", // 220, 215, 186
            bodyLight: "#dcd7ba", // 220, 215, 186
            bodyDark: "#2a2a37", // 42, 42, 55
            background: "#1f1f28", // 31, 31, 40
            backgroundNav: "#2a2a37", // 42, 42, 55
            muted: "#6f6f90", // 111, 111, 144
            menu: "#1f1f28", // 31, 31, 40

            success: "#98bb6c", // 152, 187, 108
            danger: "#ff5d62", // 255, 93, 98
            warning: "#ffa066", // 255, 160, 102
            info: "#7fb4ca", // 127, 180, 202

            orange: "#ffa066", // 255, 160, 102
            yellow: "#e6c384", // 230, 195, 132
            green: "#98bb6c", // 152, 187, 108
            aqua: "#67d8c2", // 103, 216, 194
            blue: "#a3d4d5", // 163, 212, 213
            purple: "#957fb8", // 149, 127, 184
            pink: "#d27e99", // 210, 126, 153
            gray: "#54546d", // 84, 84, 109
        },
    },
    monokai_pro: {
        // Harder to find a palette, but here's where these were taken:
        // https://github.com/loctvl842/monokai-pro.nvim/blob/master/lua/monokai-pro/colorscheme/palette/pro.lua
        name: "Monokai Pro",
        mode: "dark",
        // Secondary is different to muted
        colors: {
            primary: "#ffd866", // 255, 216, 102
            secondary: "#ff6188", // 255, 97, 136
            body: "#fcfcfa", // 252, 252, 250
            bodyLight: "#fcfcfa", // 252, 252, 250
            bodyDark: "#3c393d", // 60, 57, 61
            background: "#2d2a2e", // 45, 42, 46
            backgroundNav: "#221f22", // 34, 31, 34
            muted: "#8d8b8d", // 141, 139, 141
            menu: "#221f22", // 34, 31, 34

            success: "#a9dc76", // 169, 220, 118
            danger: "#ff6188", // 255, 97, 136
            warning: "#fc9867", // 252, 152, 103
            info: "#78dce8", // 120, 220, 232

            orange: "#fc9867", // 252, 152, 103
            yellow: "#ffd866", // 255, 216, 102
            green: "#a9dc76", // 169, 220, 118
            aqua: "#78fad4", // 120, 250, 212
            blue: "#78dce8", // 120, 220, 232
            purple: "#ab9df2", // 171, 157, 242
            pink: "#ff6188", // 255, 97, 136
            gray: "#727072", // 114, 112, 114
        },
    },
    dracula: {
        // https://github.com/dracula/dracula-theme
        name: "Dracula",
        mode: "dark",
        // Secondary is different to muted
        colors: {
            primary: "#bd93f9", // 189, 147, 249
            secondary: "#50fa7b", // 80, 250, 123
            body: "#f8f8f2", // 248, 248, 242
            bodyLight: "#f8f8f2", // 248, 248, 242
            bodyDark: "#44475a", // 68, 71, 90
            background: "#282a36", // 40, 42, 54
            backgroundNav: "#44475a", // 68, 71, 90
            muted: "#7c7f9c", // 124, 127, 156
            menu: "#282a36", // 40, 42, 54

            success: "#50fa7b", // 80, 250, 123
            danger: "#ff5555", // 255, 85, 85
            warning: "#ffb86c", // 255, 184, 108
            info: "#8be9fd", // 139, 233, 253

            orange: "#ffb86c", // 255, 184, 108
            yellow: "#f1fa8c", // 241, 250, 140
            green: "#50fa7b", // 80, 250, 123
            aqua: "#8be9fd", // 139, 233, 253
            blue: "#6272a4", // 98, 114, 164
            purple: "#bd93f9", // 189, 147, 249
            pink: "#ff79c6", // 255, 121, 198
            gray: "#585b74", // 88, 91, 116
        },
    },
    gruvbox_dark: {
        // https://github.com/morhetz/gruvbox
        name: "Gruvbox Dark",
        mode: "dark",
        // Secondary is the same as muted
        colors: {
            primary: "#b8bb26", // 184, 187, 38
            secondary: "#85837a", // 133, 131, 122
            body: "#ebdbb2", // 235, 219, 178
            bodyLight: "#ebdbb2", // 235, 219, 178
            bodyDark: "#3c3836", // 60, 56, 54
            background: "#282828", // 40, 40, 40
            backgroundNav: "#3c3836", // 60, 56, 54
            muted: "#85837a", // 133, 131, 122
            menu: "#282828", // 40, 40, 40

            success: "#b8bb26", // 184, 187, 38
            danger: "#fb4934", // 251, 73, 52
            warning: "#fabd2e", // 250, 189, 46
            info: "#83a598", // 131, 165, 152

            orange: "#fe8019", // 254, 128, 25
            yellow: "#fabd2f", // 250, 189, 47
            green: "#b8bb26", // 184, 187, 38
            aqua: "#8ec07c", // 142, 192, 124
            blue: "#83a598", // 131, 165, 152
            purple: "#b16286", // 177, 98, 134
            pink: "#d3869b", // 211, 134, 155
            gray: "#928374", // 146, 131, 116
        },
    },
    light: {
        // Custom scheme
        name: "Light",
        mode: "light",
        // Secondary is the same as muted
        colors: {
            primary: "#5a8aa2", // 90, 138, 162
            secondary: "#737373", // 115, 115, 115
            body: "#1a1a1a", // 26, 26, 26
            bodyLight: "#e0e0e0", // 224, 224, 224
            bodyDark: "#1a1a1a", // 26, 26, 26
            background: "#ffffff", // 255, 255, 255
            backgroundNav: "#f5f5f5", // 245, 245, 245
            muted: "#737373", // 115, 115, 115
            menu: "#ffffff", // 255, 255, 255

            success: "#3b824e", // 59, 130, 78
            danger: "#993d3d", // 153, 61, 61
            warning: "#996a3d", // 153, 106, 61
            info: "#3d7999", // 61, 121, 153

            orange: "#e58650", // 229, 134, 80
            yellow: "#e6b85a", // 230, 184, 90
            green: "#7d9e57", // 125, 158, 87
            aqua: "#50d1a7", // 80, 209, 167
            blue: "#6fb0b7", // 111, 176, 183
            purple: "#8570b5", // 133, 112, 181
            pink: "#b3506a", // 179, 80, 106
            gray: "#9e9da6", // 158, 157, 166
        },
    },
    gruvbox_light: {
        // https://github.com/morhetz/gruvbox
        name: "Gruvbox Light",
        mode: "light",
        // Secondary is the same as muted
        colors: {
            primary: "#af3a03", // 175, 58, 3
            secondary: "#7c6f64", // 124, 111, 100
            body: "#3c3836", // 60, 56, 54
            bodyLight: "#f9f5d7", // 249, 245, 215
            bodyDark: "#3c3836", // 60, 56, 54
            background: "#fbf1c7", // 251, 241, 199
            backgroundNav: "#f9f5d7", // 249, 245, 215
            muted: "#7c6f64", // 124, 111, 100
            menu: "#f9f5d7", // 249, 245, 215

            success: "#79740e", // 121, 116, 14
            danger: "#9d0006", // 157, 0, 6
            warning: "#b57614", // 181, 118, 20
            info: "#076678", // 7, 102, 120

            orange: "#d65d0e", // 214, 93, 14
            yellow: "#b57614", // 181, 118, 20
            green: "#79740e", // 121, 116, 14
            aqua: "#427b58", // 66, 123, 88
            blue: "#076678", // 7, 102, 120
            purple: "#8f3f71", // 143, 63, 113
            pink: "#b16286", // 177, 98, 134
            gray: "#7c6f64", // 124, 111, 100
        },
    },
    pastel: {
        // Custom scheme
        name: "Pastel",
        mode: "light",
        // Secondary is the same as muted
        colors: {
            primary: "#79a9d1", // 121, 169, 209
            secondary: "#737373", // 115, 115, 115
            body: "#64666b", // 100, 102, 107
            bodyLight: "#f0ebdb", // 240, 235, 219
            bodyDark: "#64666b", // 100, 102, 107
            background: "#e9e2cc", // 233, 226, 204
            backgroundNav: "#f0ebdb", // 240, 235, 219
            muted: "#737373", // 115, 115, 115
            menu: "#f0ebdb", // 240, 235, 219

            success: "#77dd77", // 119, 221, 119
            danger: "#ff6961", // 255, 105, 97
            warning: "#ffb347", // 255, 179, 71
            info: "#79a9d1", // 121, 169, 209

            orange: "#ffb347", // 255, 179, 71
            yellow: "#fff68f", // 255, 246, 143
            green: "#77dd77", // 119, 221, 119
            aqua: "#76d7c4", // 118, 215, 196
            blue: "#79a9d1", // 121, 169, 209
            purple: "#c39bd3", // 195, 155, 211
            pink: "#f7b7d2", // 247, 183, 210
            gray: "#c0c0c0", // 192, 192, 192
        },
    },
};
