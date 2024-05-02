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
                type: "periodic",
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
                key: "hard_bosses",
                name: "Hard Bosses",
                color: "muted",
                type: "fixed_time",
                phases: [
                    {
                        key: "tequatl_the_sunless",
                        name: "Tequatl the Sunless",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_Tequatl_the_Sunless",
                        times: [0, 180, 420, 690, 960, 1140],
                        duration: 30,
                    },
                    {
                        key: "triple_trouble",
                        name: "Triple Trouble",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Triple_Trouble",
                        times: [60, 240, 480, 750, 1020, 1200],
                        duration: 30,
                    },
                    {
                        key: "karka_queen",
                        name: "Karka Queen",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Karka_Queen_threatening_the_settlements",
                        times: [120, 360, 630, 900, 1080, 1380],
                        duration: 30,
                    },
                ],
            },
            {
                key: "ley_line_anomaly",
                name: "Ley-Line Anomaly",
                color: "muted",
                type: "periodic",
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
                        start: 20,
                        duration: 20,
                        frequency: 360,
                    },
                ],
            },
        ],
    },
    {
        key: "living_world_season_2",
        name: "LWS2",
        color: "warning",
        sub_areas: [
            {
                key: "dry_top",
                name: "Dry Top",
                color: "warning",
                type: "periodic",
                phases: [
                    {
                        key: "sandstorm",
                        name: "Sandstorm",
                        wikiUrl: "https://wiki.guildwars2.com/wiki/Sandstorm!",
                        start: 40,
                        duration: 20,
                        frequency: 60,
                    },
                    {
                        key: "crash_site",
                        name: "Crash Site",
                        type: "downtime",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Crash_Site_(meta_event)",
                        start: 0,
                        duration: 40,
                        frequency: 60,
                    },
                ],
            },
        ],
    },
    {
        key: "heart_of_thorns",
        name: "HoT",
        color: "success",
        sub_areas: [
            {
                key: "verdant_brink",
                name: "Verdant Brink",
                color: "success",
                type: "periodic",
                phases: [
                    {
                        key: "verdant_brink__night_and_the_enemy",
                        name: "Night: Night and the Enemy",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Night_and_the_Enemy",
                        start: 105,
                        duration: 25,
                        frequency: 120,
                    },
                    {
                        key: "verdant_brink__night_bosses",
                        name: "Night Bosses",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Night_and_the_Enemy",
                        start: 10,
                        duration: 20,
                        frequency: 120,
                    },
                    {
                        key: "verdant_brink__day",
                        name: "Day: Securing Verdant Brink",
                        type: "downtime",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Securing_Verdant_Brink",
                        start: 30,
                        duration: 75,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "auric_basin",
                name: "Auric Basin",
                color: "success",
                type: "periodic",
                phases: [
                    {
                        key: "auric_basin__challenges",
                        name: "Challenges",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Battle_in_Tarir",
                        start: 45,
                        duration: 15,
                        frequency: 120,
                    },
                    {
                        key: "auric_basin__octovine",
                        name: "Octovine",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Battle_in_Tarir",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                    },
                    {
                        key: "auric_basin__pylons",
                        name: "Pylons",
                        type: "downtime",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defending_Tarir",
                        start: 90,
                        duration: 75,
                        frequency: 120,
                    },
                ],
                downtime: {
                    name: "Reset",
                },
            },
            {
                key: "tangled_depths",
                name: "Tangled Depths",
                color: "success",
                type: "periodic",
                phases: [
                    {
                        key: "tangled_depths__chak_gerent",
                        name: "Prep",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/King_of_the_Jungle",
                        start: 25,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "tangled_depths__chak_gerent",
                        name: "Chak Gerent",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/King_of_the_Jungle",
                        start: 30,
                        duration: 20,
                        frequency: 120,
                    },
                ],
                downtime: {
                    name: "Help the Outposts",
                    wikiUrl:
                        "https://wiki.guildwars2.com/wiki/Advancing_Across_Tangled_Roots",
                },
            },
            {
                key: "dragons_stand",
                name: "Dragon's Stand",
                color: "success",
                type: "periodic",
                phases: [
                    {
                        key: "dragons_stand__blighting_towers",
                        name: "Advancing on the Blighting Towers",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Advancing_on_the_Blighting_Towers",
                        start: 90,
                        duration: 120,
                        frequency: 120,
                    },
                ],
            },
        ],
    },
    {
        key: "living_world_season_3",
        name: "LWS3",
        color: "muted",
        sub_areas: [
            {
                key: "lake_doric",
                name: "Lake Doric",
                color: "muted",
                type: "periodic",
                phases: [
                    {
                        key: "norans_homestead",
                        name: "Noran's Homestead",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/White_Mantle_Control:_Noran's_Homestead",
                        start: 30,
                        duration: 30,
                        frequency: 120,
                    },
                    {
                        key: "saidras_haven",
                        name: "Saidra's Haven",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/White_Mantle_Control:_Saidra's_Haven",
                        start: 60,
                        duration: 45,
                        frequency: 120,
                    },
                    {
                        key: "new_loamhurst",
                        name: "New Loamhurst",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/White_Mantle_Control:_New_Loamhurst",
                        start: 105,
                        duration: 45,
                        frequency: 120,
                    },
                ],
            },
        ],
    },
    {
        key: "path_of_fire",
        name: "PoF",
        color: "warning",
        sub_areas: [
            {
                key: "crystal_oasis",
                name: "Crystal Oasis",
                color: "warning",
                type: "periodic",
                phases: [
                    {
                        key: "crystal_oasis__collect_coins",
                        name: "Collect coins",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Casino_Blitz",
                        start: 5,
                        duration: 15,
                        frequency: 120,
                    },
                    {
                        key: "crystal_oasis__pinata",
                        name: "Piñata",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Casino_Blitz",
                        start: 20,
                        duration: 10,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "desert_highlands",
                name: "Desert Highlands",
                color: "warning",
                type: "periodic",
                phases: [
                    {
                        key: "desert_highlands__buried_treasure",
                        name: "Buried Treasure",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Search_for_Buried_Treasure",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "elon_riverlands",
                name: "Elon Riverlands",
                color: "warning",
                type: "periodic",
                phases: [
                    {
                        key: "elon_riverlands__path_to_ascension",
                        name: "The Path to Ascension",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Path_to_Ascension",
                        start: 90,
                        duration: 25,
                        frequency: 120,
                    },
                    {
                        key: "elon_riverlands__doppelganger",
                        name: "Doppelganger",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Shift_beyond_reality_to_confront_the_crazed_doppelganger",
                        start: 115,
                        duration: 20,
                        frequency: 120,
                    },
                ],
            },
        ],
    },
];

export default META_EVENTS;
