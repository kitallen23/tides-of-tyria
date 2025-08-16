export const COLOR_TYPES = {
    orange: "orange",
    yellow: "yellow",
    green: "green",
    aqua: "aqua",
    blue: "blue",
    purple: "purple",
    pink: "pink",
    gray: "gray",
    light: "light",
    dark: "dark",
};
export const ON_COMPLETE_TYPES = {
    completeEvent: "complete_event",
    completeArea: "complete_area",
    none: "none",
};
export const TIME_TYPES = {
    periodic: "periodic",
    fixedTime: "fixed_time",
};
const META_EVENTS = [
    {
        key: "core_tyria",
        name: "CORE",
        color: COLOR_TYPES.gray,
        version: "2025-07-21_01",
        sub_areas: [
            {
                key: "day-night__tyria",
                name: "Day-Night Cycle (Tyria)",
                color: COLOR_TYPES.light,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                disableIndexing: true,
                phases: [
                    {
                        key: "day-night__tyria__dawn",
                        name: "Dawn",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 25,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "day-night__tyria__day",
                        name: "Day",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 30,
                        duration: 70,
                        frequency: 120,
                    },
                    {
                        key: "day-night__tyria__dusk",
                        name: "Dusk",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 100,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "day-night__tyria__night",
                        name: "Night",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 105,
                        duration: 40,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "world_bosses",
                name: "World Bosses",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                phases: [
                    {
                        key: "admiral_taidha_covington",
                        name: "Admiral Taidha Covington",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kill_Admiral_Taidha_Covington",
                        start: 0,
                        duration: 15,
                        frequency: 180,
                        waypoint: "[&BKgBAAA=]",
                    },
                    {
                        key: "svanir_shaman_chief",
                        name: "Svanir Shaman Chief",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kill_the_Svanir_shaman_chief_to_break_his_control_over_the_ice_elemental",
                        start: 15,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BMIDAAA=]",
                    },
                    {
                        key: "megadestroyer",
                        name: "Megadestroyer",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kill_the_megadestroyer_before_it_blows_everyone_up",
                        start: 30,
                        duration: 15,
                        frequency: 180,
                        waypoint: "[&BM0CAAA=]",
                    },
                    {
                        key: "fire_elemental",
                        name: "Fire Elemental",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Destroy_the_fire_elemental_created_from_chaotic_energy_fusing_with_the_C.L.E.A.N._5000%27s_energy_core",
                        start: 45,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BEcAAAA=]",
                    },
                    {
                        key: "the_shatterer",
                        name: "The Shatterer",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Slay_the_Shatterer",
                        start: 60,
                        duration: 15,
                        frequency: 180,
                        waypoint: "[&BE4DAAA=]",
                    },
                    {
                        key: "great_jungle_wurm",
                        name: "Great Jungle Wurm",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_great_jungle_wurm",
                        start: 75,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BEEFAAA=]",
                    },
                    {
                        key: "modniir_ulgoth",
                        name: "Modniir Ulgoth",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_Ulgoth_the_Modniir_and_his_minions",
                        start: 90,
                        duration: 15,
                        frequency: 180,
                        waypoint: "[&BLAAAAA=]",
                    },
                    {
                        key: "shadow_behemoth",
                        name: "Shadow Behemoth",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_shadow_behemoth",
                        start: 105,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BPcAAAA=]",
                    },
                    {
                        key: "golem_mark_ii",
                        name: "Golem Mark II",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Inquest%27s_golem_Mark_II",
                        start: 120,
                        duration: 15,
                        frequency: 180,
                        waypoint: "[&BNQCAAA=]",
                    },
                    {
                        key: "claw_of_jormag",
                        name: "Claw of Jormag",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Claw_of_Jormag",
                        start: 150,
                        duration: 15,
                        frequency: 180,
                        waypoint: "[&BHoCAAA=]",
                    },
                ],
            },
            {
                key: "hard_bosses",
                name: "Hard Bosses",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.fixedTime,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                phases: [
                    {
                        key: "tequatl_the_sunless",
                        name: "Tequatl the Sunless",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_Tequatl_the_Sunless",
                        times: [0, 180, 420, 690, 960, 1140],
                        duration: 30,
                        waypoint: "[&BNABAAA=]",
                    },
                    {
                        key: "triple_trouble",
                        name: "Triple Trouble",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Triple_Trouble",
                        times: [60, 240, 480, 750, 1020, 1200],
                        duration: 30,
                        waypoint: "[&BKoBAAA=]",
                    },
                    {
                        key: "karka_queen",
                        name: "Karka Queen",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Karka_Queen_threatening_the_settlements",
                        times: [120, 360, 630, 900, 1080, 1380],
                        duration: 30,
                        waypoint: "[&BNUGAAA=]",
                    },
                ],
            },
            {
                key: "ley_line_anomaly",
                name: "Ley-Line Anomaly",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                disableIndexing: true,
                phases: [
                    {
                        key: "ley_line_anomaly__iron_marches",
                        name: "LLA: Iron Marches",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Ley-Line_Anomaly_to_disperse_its_destructive_energy_before_it_overloads",
                        start: 140,
                        duration: 20,
                        frequency: 360,
                        waypoint: "[&BOcBAAA=]",
                    },
                    {
                        key: "ley_line_anomaly__gendarran_fields",
                        name: "LLA: Gendarran Fields",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Ley-Line_Anomaly_to_disperse_its_destructive_energy_before_it_overloads",
                        start: 260,
                        duration: 20,
                        frequency: 360,
                        waypoint: "[&BOQAAAA=]",
                    },
                    {
                        key: "ley_line_anomaly__timberline_falls",
                        name: "LLA: Timberline Falls",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Ley-Line_Anomaly_to_disperse_its_destructive_energy_before_it_overloads",
                        start: 20,
                        duration: 20,
                        frequency: 360,
                        waypoint: "[&BEwCAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "living_world_season_2",
        name: "LWS2",
        color: COLOR_TYPES.yellow,
        sub_areas: [
            {
                key: "dry_top",
                name: "Dry Top",
                color: COLOR_TYPES.yellow,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                phases: [
                    {
                        key: "sandstorm",
                        name: "Sandstorm",
                        wikiUrl: "https://wiki.guildwars2.com/wiki/Sandstorm!",
                        start: 40,
                        duration: 20,
                        frequency: 60,
                        waypoint: "[&BIAHAAA=]",
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
                        waypoint: "[&BIAHAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "heart_of_thorns",
        name: "HoT",
        color: COLOR_TYPES.green,
        sub_areas: [
            {
                key: "verdant_brink",
                name: "Verdant Brink",
                color: COLOR_TYPES.green,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "verdant_brink__night_and_the_enemy",
                        name: "Night: Night and the Enemy",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Night_and_the_Enemy",
                        start: 105,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BAgIAAA=]",
                    },
                    {
                        key: "verdant_brink__night_bosses",
                        name: "Night Bosses",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Night_and_the_Enemy",
                        start: 10,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BAgIAAA=]",
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
                        waypoint: "[&BN4HAAA=]",
                    },
                ],
            },
            {
                key: "auric_basin",
                name: "Auric Basin",
                color: COLOR_TYPES.green,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "auric_basin__challenges",
                        name: "Challenges",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Battle_in_Tarir",
                        start: 45,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BGwIAAA=]",
                    },
                    {
                        key: "auric_basin__octovine",
                        name: "Octovine",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Battle_in_Tarir",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BAIIAAA=]",
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
                        waypoint: "[&BN0HAAA=]",
                    },
                ],
                downtime: {
                    name: "Reset",
                },
            },
            {
                key: "tangled_depths",
                name: "Tangled Depths",
                color: COLOR_TYPES.green,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "tangled_depths__chak_gerent",
                        name: "Prep",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/King_of_the_Jungle",
                        start: 25,
                        duration: 5,
                        frequency: 120,
                        waypoint: "[&BPUHAAA=]",
                    },
                    {
                        key: "tangled_depths__chak_gerent",
                        name: "Chak Gerent",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/King_of_the_Jungle",
                        start: 30,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BPUHAAA=]",
                    },
                    {
                        key: "tangled_depths__help_the_outposts",
                        name: "Help the Outposts",
                        type: "downtime",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Advancing_Across_Tangled_Roots",
                        start: 50,
                        duration: 95,
                        frequency: 120,
                        waypoint: "[&BA4IAAA=]",
                    },
                ],
            },
            {
                key: "dragons_stand",
                name: "Dragon's Stand",
                color: COLOR_TYPES.green,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "dragons_stand__blighting_towers",
                        name: "Advancing on the Blighting Towers",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Advancing_on_the_Blighting_Towers",
                        start: 90,
                        duration: 120,
                        frequency: 120,
                        waypoint: "[&BBAIAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "living_world_season_3",
        name: "LWS3",
        color: COLOR_TYPES.gray,
        sub_areas: [
            {
                key: "lake_doric",
                name: "Lake Doric",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                phases: [
                    {
                        key: "norans_homestead",
                        name: "Noran's Homestead",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/White_Mantle_Control:_Noran's_Homestead",
                        start: 30,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BK8JAAA=]",
                    },
                    {
                        key: "saidras_haven",
                        name: "Saidra's Haven",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/White_Mantle_Control:_Saidra's_Haven",
                        start: 60,
                        duration: 45,
                        frequency: 120,
                        waypoint: "[&BK0JAAA=]",
                    },
                    {
                        key: "new_loamhurst",
                        name: "New Loamhurst",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/White_Mantle_Control:_New_Loamhurst",
                        start: 105,
                        duration: 45,
                        frequency: 120,
                        waypoint: "[&BLQJAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "path_of_fire__ungrouped",
        name: "PoF",
        color: COLOR_TYPES.orange,
        grouped: false,
        sub_areas: [
            {
                key: "crystal_oasis",
                name: "Crystal Oasis",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "crystal_oasis__casino_blitz",
                        name: "Collect coins",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Casino_Blitz",
                        start: 5,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BLsKAAA=]",
                    },
                    {
                        key: "crystal_oasis__casino_blitz",
                        name: "Piñata",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Casino_Blitz",
                        start: 20,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BLsKAAA=]",
                    },
                ],
            },
            {
                key: "desert_highlands",
                name: "Desert Highlands",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "desert_highlands__buried_treasure",
                        name: "Buried Treasure",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Search_for_Buried_Treasure",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BGsKAAA=]",
                    },
                ],
            },
            {
                key: "elon_riverlands",
                name: "Elon Riverlands",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "elon_riverlands__path_to_ascension",
                        name: "The Path to Ascension",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Path_to_Ascension",
                        start: 90,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BFMKAAA=]",
                    },
                    {
                        key: "elon_riverlands__doppelganger",
                        name: "Doppelganger",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Shift_beyond_reality_to_confront_the_crazed_doppelganger",
                        start: 115,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BFMKAAA=]",
                    },
                ],
            },
            {
                key: "the_desolation",
                name: "The Desolation",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "the_desolation__junundu_rising",
                        name: "Junundu Rising",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Junundu_Rising",
                        start: 30,
                        duration: 20,
                        frequency: 60,
                        waypoint: "[&BMEKAAA=]",
                    },
                    {
                        key: "the_desolation__maws_of_torment",
                        name: "Maws of Torment",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Maws_of_Torment",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BKMKAAA=]",
                    },
                ],
            },
            {
                key: "domain_of_vabbi",
                name: "Domain of Vabbi",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "domain_of_vabbi__forged_with_fire",
                        name: "Forged with Fire",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Forged_with_Fire",
                        start: 60,
                        duration: 30,
                        frequency: 60,
                        waypoint: "[&BO0KAAA=]",
                    },
                    {
                        key: "domain_of_vabbi__serpents_ire",
                        name: "Serpents' Ire",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Serpents'_Ire",
                        start: 30,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BHQKAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "path_of_fire__grouped",
        name: "PoF",
        color: COLOR_TYPES.orange,
        grouped: true,
        sub_areas: [
            {
                key: "path_of_fire__area1",
                name: "Path of Fire: Crystal Oasis & Desert Highlands",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "crystal_oasis__casino_blitz",
                        name: "Collect coins",
                        areaName: "Crystal Oasis",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Casino_Blitz",
                        start: 5,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BLsKAAA=]",
                    },
                    {
                        key: "crystal_oasis__casino_blitz",
                        name: "Piñata",
                        areaName: "Crystal Oasis",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Casino_Blitz",
                        start: 20,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BLsKAAA=]",
                    },
                    {
                        key: "desert_highlands__buried_treasure",
                        name: "Buried Treasure",
                        areaName: "Desert Highlands",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Search_for_Buried_Treasure",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BGsKAAA=]",
                    },
                ],
            },
            {
                key: "elon_riverlands",
                name: "Elon Riverlands",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                disableIndexing: true,
                phases: [
                    {
                        key: "elon_riverlands__path_to_ascension",
                        name: "The Path to Ascension",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Path_to_Ascension",
                        start: 90,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BFMKAAA=]",
                    },
                    {
                        key: "elon_riverlands__doppelganger",
                        name: "Doppelganger",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Shift_beyond_reality_to_confront_the_crazed_doppelganger",
                        start: 115,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BFMKAAA=]",
                    },
                ],
            },
            {
                key: "the_desolation",
                name: "The Desolation",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                disableIndexing: true,
                phases: [
                    {
                        key: "the_desolation__junundu_rising",
                        name: "Junundu Rising",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Junundu_Rising",
                        start: 30,
                        duration: 20,
                        frequency: 60,
                        waypoint: "[&BMEKAAA=]",
                    },
                    {
                        key: "the_desolation__maws_of_torment",
                        name: "Maws of Torment",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Maws_of_Torment",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BKMKAAA=]",
                    },
                ],
            },
            {
                key: "domain_of_vabbi",
                name: "Domain of Vabbi",
                color: COLOR_TYPES.orange,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                disableIndexing: true,
                phases: [
                    {
                        key: "domain_of_vabbi__forged_with_fire",
                        name: "Forged with Fire",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Forged_with_Fire",
                        start: 60,
                        duration: 30,
                        frequency: 60,
                        waypoint: "[&BO0KAAA=]",
                    },
                    {
                        key: "domain_of_vabbi__serpents_ire",
                        name: "Serpents' Ire",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Serpents'_Ire",
                        start: 30,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BHQKAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "living_world_season_4__ungrouped",
        name: "LWS4",
        color: COLOR_TYPES.purple,
        grouped: false,
        sub_areas: [
            {
                key: "domain_of_istan",
                name: "Domain of Istan",
                color: COLOR_TYPES.purple,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "domain_of_istan__palawadan",
                        name: "Palawadan",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Palawadan,_Jewel_of_Istan_(meta_event)",
                        start: 105,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BAkLAAA=]",
                    },
                ],
            },
            {
                key: "jahai_bluffs",
                name: "Jahai Bluffs",
                color: COLOR_TYPES.purple,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "jahai_bluffs__death_branded_shatterer",
                        name: "Escorts",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Dangerous_Prey",
                        start: 60,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BIMLAAA=]",
                    },
                    {
                        key: "jahai_bluffs__death_branded_shatterer",
                        name: "Death Branded Shatterer",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Destroy_the_Death-Branded_Shatterer",
                        start: 75,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BJMLAAA=]",
                    },
                ],
            },
            {
                key: "thunderhead_peaks",
                name: "Thunderhead Peaks",
                color: COLOR_TYPES.purple,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "thunderhead_peaks__the_oil_floes",
                        name: "The Oil Floes",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Oil_Floes",
                        start: 45,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BKYLAAA=]",
                    },
                    {
                        key: "thunderhead_peaks__thunderhead_keep",
                        name: "Thunderhead Keep",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Thunderhead_Keep_(meta_event)",
                        start: 105,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BLsLAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "living_world_season_4__grouped",
        name: "LWS4",
        color: COLOR_TYPES.purple,
        grouped: true,
        sub_areas: [
            {
                key: "living_world_season_4__area1",
                name: "Living World Season 4: Domain of Istan & Jahai Bluffs",
                color: COLOR_TYPES.purple,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "domain_of_istan__palawadan",
                        name: "Palawadan",
                        areaName: "Domain of Istan",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Palawadan,_Jewel_of_Istan_(meta_event)",
                        start: 105,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BAkLAAA=]",
                    },
                    {
                        key: "jahai_bluffs__death_branded_shatterer",
                        name: "Escorts",
                        areaName: "Jahai Bluffs",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Dangerous_Prey",
                        start: 60,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BIMLAAA=]",
                    },
                    {
                        key: "jahai_bluffs__death_branded_shatterer",
                        name: "Death Branded Shatterer",
                        areaName: "Jahai Bluffs",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Destroy_the_Death-Branded_Shatterer",
                        start: 75,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BJMLAAA=]",
                    },
                ],
            },
            {
                key: "thunderhead_peaks",
                name: "Thunderhead Peaks",
                color: COLOR_TYPES.purple,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "thunderhead_peaks__the_oil_floes",
                        name: "The Oil Floes",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Oil_Floes",
                        start: 45,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BKYLAAA=]",
                    },
                    {
                        key: "thunderhead_peaks__thunderhead_keep",
                        name: "Thunderhead Keep",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Thunderhead_Keep_(meta_event)",
                        start: 105,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BLsLAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "the_icebrood_saga",
        name: "IBS",
        color: COLOR_TYPES.blue,
        sub_areas: [
            {
                key: "grothmar_valley",
                name: "Grothmar Valley",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                phases: [
                    {
                        key: "grothmar_valley__effigy",
                        name: "Effigy",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Ceremony_of_the_Sacred_Flame",
                        start: 10,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BA4MAAA=]",
                    },
                    {
                        key: "grothmar_valley__doomlore_shrine",
                        name: "Doomlore Shrine",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Haunting_of_Doomlore_Shrine",
                        start: 38,
                        duration: 22,
                        frequency: 120,
                        waypoint: "[&BA4MAAA=]",
                    },
                    {
                        key: "grothmar_valley__ooze_pits",
                        name: "Ooze Pits",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Ooze_Pit_Trials",
                        start: 65,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BPgLAAA=]",
                    },
                    {
                        key: "grothmar_valley__metal_concert",
                        name: "Metal Concert",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/A_Concert_for_the_Ages",
                        start: 100,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BPgLAAA=]",
                    },
                ],
            },
            {
                key: "bjora_marches",
                name: "Bjora Marches",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                phases: [
                    {
                        key: "bjora_marches__drakkar",
                        name: "Drakkar",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Champion_of_the_Ice_Dragon",
                        start: 65,
                        duration: 35,
                        frequency: 120,
                        waypoint: "[&BDkMAAA=]",
                    },
                    {
                        key: "bjora_marches__storms_of_winter",
                        name: "Defend Jora's Keep",
                        metaName:
                            "Storms of Winter: Defend Jora's Keep, Shards & Construct, Icebrood Champions",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Storms_of_Winter",
                        start: 105,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BCcMAAA=]",
                    },
                    {
                        key: "bjora_marches__storms_of_winter",
                        name: "Shards & Construct",
                        metaName:
                            "Storms of Winter: Defend Jora's Keep, Shards & Construct, Icebrood Champions",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Storms_of_Winter",
                        start: 0,
                        duration: 5,
                        frequency: 120,
                        waypoint: "[&BCcMAAA=]",
                    },
                    {
                        key: "bjora_marches__storms_of_winter",
                        name: "Icebrood Champions",
                        metaName:
                            "Storms of Winter: Defend Jora's Keep, Shards & Construct, Icebrood Champions",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Storms_of_Winter",
                        start: 5,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BCcMAAA=]",
                    },
                ],
            },
            {
                key: "eye_of_the_north",
                name: "Eye of the North (instance)",
                displayTitle: "Dragonstorm",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "dragonstorm",
                        name: "Dragonstorm",
                        wikiUrl: "https://wiki.guildwars2.com/wiki/Dragonstorm",
                        start: 60,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BAkMAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "end_of_dragons__ungrouped",
        name: "EoD",
        color: COLOR_TYPES.aqua,
        grouped: false,
        sub_areas: [
            {
                key: "day-night__cantha",
                name: "Day-Night Cycle (Cantha)",
                color: COLOR_TYPES.light,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                disableIndexing: true,
                phases: [
                    {
                        key: "day-night__cantha__dawn",
                        name: "Dawn",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 35,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "day-night__cantha__day",
                        name: "Day",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 40,
                        duration: 55,
                        frequency: 120,
                    },
                    {
                        key: "day-night__cantha__dusk",
                        name: "Dusk",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 95,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "day-night__cantha__night",
                        name: "Night",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 100,
                        duration: 55,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "seitung_province",
                name: "Seitung Province",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "seitung_province__aetherblade_assault",
                        name: "Aetherblade Assault",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Aetherblade_Assault",
                        start: 90,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BGUNAAA=]",
                    },
                ],
            },
            {
                key: "new_kaineng_city",
                name: "New Kaineng City",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "new_kaineng_city__kaineng_blackout",
                        name: "Kaineng Blackout",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kaineng_Blackout",
                        start: 0,
                        duration: 40,
                        frequency: 120,
                        waypoint: "[&BBkNAAA=]",
                    },
                ],
            },
            {
                key: "the_echovald_wilds",
                name: "The Echovald Wilds",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                phases: [
                    {
                        key: "the_echovald_wilds__aspenwood",
                        name: "Aspenwood",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Use_the_siege_turtles_to_destroy_the_shield_generators_as_you_fight_through_the_fort",
                        start: 100,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BPkMAAA=]",
                    },
                    {
                        key: "the_echovald_wilds__gang_war",
                        name: "Gang War",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Gang_War_of_Echovald",
                        start: 30,
                        duration: 35,
                        frequency: 120,
                        waypoint: "[&BMwMAAA=]",
                    },
                ],
            },
            {
                key: "dragons_end",
                name: "Dragon's End",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.fixedTime,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                downtime: {
                    name: "Preparations",
                },
                phases: [
                    {
                        key: "dragons_end__jade_maw",
                        name: "Jade Maw",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Void-corrupted_Jade_Maw",
                        times: [
                            5, 45, 125, 165, 245, 285, 365, 405, 485, 525, 605,
                            645, 725, 765, 845, 885, 965, 1005, 1085, 1125,
                            1205, 1245, 1325, 1365,
                        ],
                        duration: 8,
                        waypoint: "[&BKIMAAA=]",
                    },
                    {
                        key: "dragons_end__the_battle_for_the_jade_sea",
                        name: "The Battle for the Jade Sea",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Battle_for_the_Jade_Sea",
                        times: [
                            60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140,
                            1260, 1380,
                        ],
                        duration: 60,
                        waypoint: "[&BKIMAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "end_of_dragons__grouped",
        name: "EoD",
        color: COLOR_TYPES.aqua,
        grouped: true,
        sub_areas: [
            {
                key: "day-night__cantha",
                name: "Day-Night Cycle (Cantha)",
                color: COLOR_TYPES.light,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                disableIndexing: true,
                phases: [
                    {
                        key: "day-night__cantha__dawn",
                        name: "Dawn",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 35,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "day-night__cantha__day",
                        name: "Day",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 40,
                        duration: 55,
                        frequency: 120,
                    },
                    {
                        key: "day-night__cantha__dusk",
                        name: "Dusk",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 95,
                        duration: 5,
                        frequency: 120,
                    },
                    {
                        key: "day-night__cantha__night",
                        name: "Night",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Day_and_night",
                        start: 100,
                        duration: 55,
                        frequency: 120,
                    },
                ],
            },
            {
                key: "end_of_dragons__area1",
                name: "End of Dragons: Seitung Province & Kaineng Blackout",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "seitung_province__aetherblade_assault",
                        name: "Aetherblade Assault",
                        areaName: "Seitung Province",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Aetherblade_Assault",
                        start: 90,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BGUNAAA=]",
                    },
                    {
                        key: "new_kaineng_city__kaineng_blackout",
                        name: "Kaineng Blackout",
                        areaName: "New Kaineng City",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Kaineng_Blackout",
                        start: 0,
                        duration: 40,
                        frequency: 120,
                        waypoint: "[&BBkNAAA=]",
                    },
                ],
            },
            {
                key: "the_echovald_wilds",
                name: "The Echovald Wilds",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "the_echovald_wilds__aspenwood",
                        name: "Aspenwood",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Use_the_siege_turtles_to_destroy_the_shield_generators_as_you_fight_through_the_fort",
                        start: 100,
                        duration: 20,
                        frequency: 120,
                        waypoint: "[&BPkMAAA=]",
                    },
                    {
                        key: "the_echovald_wilds__gang_war",
                        name: "Gang War",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Gang_War_of_Echovald",
                        start: 30,
                        duration: 35,
                        frequency: 120,
                        waypoint: "[&BMwMAAA=]",
                    },
                ],
            },
            {
                key: "dragons_end",
                name: "Dragon's End",
                color: COLOR_TYPES.aqua,
                type: TIME_TYPES.fixedTime,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                disableIndexing: true,
                downtime: {
                    name: "Preparations",
                },
                phases: [
                    {
                        key: "dragons_end__jade_maw",
                        name: "Jade Maw",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Defeat_the_Void-corrupted_Jade_Maw",
                        times: [
                            5, 45, 125, 165, 245, 285, 365, 405, 485, 525, 605,
                            645, 725, 765, 845, 885, 965, 1005, 1085, 1125,
                            1205, 1245, 1325, 1365,
                        ],
                        duration: 8,
                        waypoint: "[&BKIMAAA=]",
                    },
                    {
                        key: "dragons_end__the_battle_for_the_jade_sea",
                        name: "The Battle for the Jade Sea",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Battle_for_the_Jade_Sea",
                        times: [
                            60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140,
                            1260, 1380,
                        ],
                        duration: 60,
                        waypoint: "[&BKIMAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "secrets_of_the_obscure__grouped",
        name: "SotO",
        color: COLOR_TYPES.yellow,
        grouped: true,
        sub_areas: [
            {
                key: "secrets_of_the_obscure__area",
                name: "Secrets of the Obscure: Skywatch Archipelago & Amnytas",
                color: COLOR_TYPES.yellow,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "skywatch_archipelago__unlocking_the_wizards_tower",
                        name: "Unlocking the Wizard's Tower",
                        areaName: "Skywatch Archipelago",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Unlocking_the_Wizard's_Tower",
                        start: 60,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BL4NAAA=]",
                    },
                    {
                        key: "amnytas__the_defense_of_amnytas",
                        name: "Defense of Amnytas",
                        areaName: "Amnytas",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Defense_of_Amnytas",
                        start: 0,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BDQOAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "secrets_of_the_obscure__ungrouped",
        name: "SotO",
        color: COLOR_TYPES.yellow,
        grouped: false,
        sub_areas: [
            {
                key: "skywatch_archipelago",
                name: "Skywatch Archipelago",
                color: COLOR_TYPES.yellow,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "skywatch_archipelago__unlocking_the_wizards_tower",
                        name: "Unlocking the Wizard's Tower",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Unlocking_the_Wizard's_Tower",
                        start: 60,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BL4NAAA=]",
                    },
                ],
            },
            {
                key: "amnytas",
                name: "Amnytas",
                color: COLOR_TYPES.yellow,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "amnytas__the_defense_of_amnytas",
                        name: "Defense of Amnytas",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/The_Defense_of_Amnytas",
                        start: 0,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BDQOAAA=]",
                    },
                ],
            },
            {
                key: "the_wizards_tower",
                name: "The Wizard's Tower (instance)",
                displayTitle: "Convergences",
                color: COLOR_TYPES.yellow,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "convergences",
                        name: "Convergence",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Convergences",
                        start: 90,
                        duration: 10,
                        frequency: 180,
                        waypoint: "[&BB8OAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "janthir_wilds__grouped",
        name: "JW",
        color: COLOR_TYPES.blue,
        grouped: true,
        sub_areas: [
            {
                key: "janthir_wilds__area_1",
                name: "Janthir Wilds: Janthir Syntri & Bava Nisos",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "janthir_syntri__of_mists_and_monsters",
                        name: "Of Mists and Monsters",
                        areaName: "Janthir Syntri",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Of_Mists_and_Monsters",
                        start: 30,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BCoPAAA=]",
                    },
                    {
                        key: "bava_nisos__a_titanic_voyage",
                        name: "A Titanic Voyage",
                        areaName: "Bava Nisos",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/A_Titanic_Voyage",
                        start: 80,
                        duration: 15,
                        frequency: 120,
                        waypoint: "[&BGEPAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "janthir_wilds__ungrouped",
        name: "JW",
        color: COLOR_TYPES.blue,
        grouped: false,
        sub_areas: [
            {
                key: "janthir_syntri",
                name: "Janthir Syntri",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "janthir_syntri__of_mists_and_monsters",
                        name: "Of Mists and Monsters",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Of_Mists_and_Monsters",
                        start: 30,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BCoPAAA=]",
                    },
                ],
            },
            {
                key: "bava_nisos",
                name: "Bava Nisos",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "bava_nisos__a_titanic_voyage",
                        name: "A Titanic Voyage",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/A_Titanic_Voyage",
                        start: 80,
                        duration: 25,
                        frequency: 120,
                        waypoint: "[&BGEPAAA=]",
                    },
                ],
            },
            {
                key: "mt_balrior",
                name: "Mount Balrior (instance)",
                displayTitle: "Convergence: Mt Balrior",
                color: COLOR_TYPES.blue,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeArea,
                phases: [
                    {
                        key: "mt_balrior__convergences",
                        name: "Convergence: Mt Balrior",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Convergence:_Mount_Balrior",
                        start: 0,
                        duration: 10,
                        frequency: 180,
                        waypoint: "[&BK4OAAA=]",
                    },
                ],
            },
        ],
    },
    {
        key: "convergences__grouped",
        name: "CONV",
        color: COLOR_TYPES.gray,
        grouped: true,
        sub_areas: [
            {
                key: "convergences__area1",
                name: "Convergences",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.completeEvent,
                disableIndexing: true,
                phases: [
                    {
                        key: "convergences",
                        name: "SotO: Convergence",
                        areaName: "The Wizard's Tower (instance)",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Convergences",
                        start: 90,
                        duration: 10,
                        frequency: 180,
                        waypoint: "[&BB8OAAA=]",
                        color: COLOR_TYPES.yellow,
                    },
                    {
                        key: "mt_balrior__convergences",
                        name: "JW: Convergence",
                        areaName: "Mount Balrior (instance)",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Convergence:_Mount_Balrior",
                        start: 0,
                        duration: 10,
                        frequency: 180,
                        waypoint: "[&BK4OAAA=]",
                        color: COLOR_TYPES.blue,
                    },
                ],
            },
        ],
    },
    {
        key: "special_events",
        name: "OTHER",
        color: COLOR_TYPES.gray,
        sub_areas: [
            {
                key: "labyrinthine_cliffs",
                name: "Labyrinthine Cliffs",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                phases: [
                    {
                        key: "labyrinthine_cliffs__treasure_hunt",
                        name: "Treasure Hunt",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Participate_in_the_treasure_hunt!",
                        start: 30,
                        duration: 30,
                        frequency: 120,
                        waypoint: "[&BBwHAAA=]",
                    },
                    {
                        key: "labyrinthine_cliffs__skiff_race",
                        name: "Skiff Race",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Labyrinthine_Skiffs:_A_race_is_starting_soon!",
                        start: 0,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BBwHAAA=]",
                    },
                    {
                        key: "labyrinthine_cliffs__fishing_tournament",
                        name: "Fishing",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Fishing_Tournament_Sign-Up",
                        start: 90,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BBwHAAA=]",
                    },
                    {
                        key: "labyrinthine_cliffs__skimmer_race",
                        name: "Skimmer Race",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Skimmer_Slalom:_Reach_the_finish_line!",
                        start: 75,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BBwHAAA=]",
                    },
                    {
                        key: "labyrinthine_cliffs__dolyak_race",
                        name: "Dolyak Race",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Flying_Dolyak:_Reach_the_finish_line!",
                        start: 105,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BBwHAAA=]",
                    },
                ],
            },
            {
                key: "halloween",
                name: "Lion's Arch",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                phases: [
                    {
                        key: "halloween__mad_king_says",
                        name: "Mad King Says",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Your_Mad_King_says...",
                        start: 0,
                        duration: 10,
                        frequency: 120,
                        waypoint: "[&BBAEAAA=]",
                    },
                ],
            },
            {
                key: "dragon_bash",
                name: "Dragon Bash",
                color: COLOR_TYPES.gray,
                type: TIME_TYPES.periodic,
                onComplete: ON_COMPLETE_TYPES.none,
                phases: [
                    {
                        key: "dragon_bash__wayfarer",
                        name: "Wayfarer Foothills",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Dragon_Bash_Hologram_Stampede!",
                        start: 0,
                        duration: 5,
                        frequency: 60,
                        waypoint: "[&BH0BAAA=]",
                    },
                    {
                        key: "dragon_bash__dredgehaunt_cliffs",
                        name: "Dredgehaunt Cliffs",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Dragon_Bash_Hologram_Stampede!",
                        start: 15,
                        duration: 5,
                        frequency: 60,
                        waypoint: "[&BGMCAAA=]",
                    },
                    {
                        key: "dragon_bash__lornars_pass",
                        name: "Lornar's Pass",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Dragon_Bash_Hologram_Stampede!",
                        start: 30,
                        duration: 5,
                        frequency: 60,
                        waypoint: "[&BJkBAAA=]",
                    },
                    {
                        key: "dragon_bash__snowden_drifts",
                        name: "Snowden Drifts",
                        wikiUrl:
                            "https://wiki.guildwars2.com/wiki/Dragon_Bash_Hologram_Stampede!",
                        start: 45,
                        duration: 5,
                        frequency: 60,
                        waypoint: "[&BL4AAAA=]",
                    },
                ],
            },
        ],
    },

    /**
     * Test
     **/
    // {
    //     key: "__test",
    //     name: "TEST",
    //     color: COLOR_TYPES.pink,
    //     sub_areas: [
    //         {
    //             key: "__test__test",
    //             name: "Test Area",
    //             color: COLOR_TYPES.pink,
    //             type: TIME_TYPES.periodic,
    //             onComplete: ON_COMPLETE_TYPES.none,
    //             phases: [
    //                 {
    //                     key: "__test__test__test1",
    //                     name: "Test Phase 1",
    //                     wikiUrl: "https://wiki.guildwars2.com",
    //                     start: 30,
    //                     duration: 30,
    //                     frequency: 120,
    //                 },
    //                 {
    //                     key: "__test__test__test2",
    //                     name: "Test Phase 2",
    //                     wikiUrl: "https://wiki.guildwars2.com",
    //                     start: 90,
    //                     duration: 30,
    //                     frequency: 120,
    //                 },
    //             ],
    //         },
    //     ],
    // },
];

export default META_EVENTS;
