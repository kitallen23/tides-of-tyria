const META_EVENTS = [
    {
        key: "core_tyria",
        name: "CORE",
        color: "muted",
        sub_areas: [
            {
                key: "world_bosses",
                name: "World Bosses",
                color: "muted",
                phases: [
                    {
                        key: "admiral_taidha_covington",
                        name: "Admiral Taidha Covington",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kill_Admiral_Taidha_Covington",
                        start: 0,
                        duration: 15,
                        frequency: 180,
                    },
                    {
                        key: "svanir_shaman_chief",
                        name: "Svanir Shaman Chief",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kill_the_Svanir_shaman_chief_to_break_his_control_over_the_ice_elemental",
                        start: 15,
                        duration: 15,
                        frequency: 120,
                    },
                    {
                        key: "megadestroyer",
                        name: "Megadestroyer",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kill_the_megadestroyer_before_it_blows_everyone_up",
                        start: 30,
                        duration: 15,
                        frequency: 180,
                    },
                    {
                        key: "fire_elemental",
                        name: "Fire Elemental",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Destroy_the_fire_elemental_created_from_chaotic_energy_fusing_with_the_C.L.E.A.N._5000%27s_energy_core",
                        start: 45,
                        duration: 15,
                        frequency: 120,
                    },
                    {
                        key: "the_shatterer",
                        name: "The Shatterer",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Slay_the_Shatterer",
                        start: 60,
                        duration: 15,
                        frequency: 180,
                    },
                    {
                        key: "great_jungle_wurm",
                        name: "Great Jungle Wurm",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_great_jungle_wurm",
                        start: 75,
                        duration: 15,
                        frequency: 120,
                    },
                    {
                        key: "modniir_ulgoth",
                        name: "Modniir Ulgoth",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_Ulgoth_the_Modniir_and_his_minions",
                        start: 90,
                        duration: 15,
                        frequency: 180,
                    },
                    {
                        key: "shadow_behemoth",
                        name: "Shadow Behemoth",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_shadow_behemoth",
                        start: 105,
                        duration: 15,
                        frequency: 120,
                    },
                    {
                        key: "golem_mark_ii",
                        name: "Golem Mark II",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Inquest%27s_golem_Mark_II",
                        start: 120,
                        duration: 15,
                        frequency: 180,
                    },
                    {
                        key: "claw_of_jormag",
                        name: "Claw of Jormag",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Claw_of_Jormag",
                        start: 150,
                        duration: 15,
                        frequency: 180,
                    },
                ],
            },
            {
                key: "ley_line_anomaly",
                name: "Ley-Line Anomaly",
                color: "muted",
                phases: [
                    {
                        key: "ley_line_anomaly__iron_marches",
                        name: "Iron Marches",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Ley-Line_Anomaly_to_disperse_its_destructive_energy_before_it_overloads",
                        start: 140,
                        duration: 20,
                        frequency: 360,
                    },
                    {
                        key: "ley_line_anomaly__gendarran_fields",
                        name: "Gendarran Fields",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Ley-Line_Anomaly_to_disperse_its_destructive_energy_before_it_overloads",
                        start: 260,
                        duration: 20,
                        frequency: 360,
                    },
                    {
                        key: "ley_line_anomaly__timberline_falls",
                        name: "Timberline Falls",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Ley-Line_Anomaly_to_disperse_its_destructive_energy_before_it_overloads",
                        start: 380,
                        duration: 20,
                        frequency: 360,
                    },
                ],
            },
            // {
            //     key: "primary-test",
            //     name: "Primary Test",
            //     color: "primary",
            //     phases: [],
            // },
            // {
            //     key: "secondary-test",
            //     name: "Secondary Test",
            //     color: "secondary",
            //     phases: [],
            // },
            // {
            //     key: "nav-background-test",
            //     name: "Nav Background Test",
            //     color: "backgroundNav",
            //     phases: [],
            // },
            // {
            //     key: "body-test",
            //     name: "Body Test",
            //     color: "body",
            //     phases: [],
            // },
            // {
            //     key: "success",
            //     name: "Success",
            //     color: "success",
            //     phases: [],
            // },
            // {
            //     key: "danger",
            //     name: "Danger",
            //     color: "danger",
            //     phases: [],
            // },
            // {
            //     key: "warning",
            //     name: "Warning",
            //     color: "warning",
            //     phases: [],
            // },
            // {
            //     key: "info",
            //     name: "Info",
            //     color: "info",
            //     phases: [],
            // },
        ],
    },
];

export default META_EVENTS;
