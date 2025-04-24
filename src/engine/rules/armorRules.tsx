export const armorRules: Record<string, () => string[]> = {
    opt_1 : () => [
        "physical_defense",
        "magic_defense",
        "additional_hp",
        "additional_mp",
    ],
    opt_2 : () => [
        "hp_regeneration_per_hit_taken",
        "mp_regeneration_per_hit_taken",
        "elemental_resistance_fire",
        "elemental_resistance_water",
        "elemental_resistance_nature",
        "elemental_resistance_ice",
        "brics_amount",
    ],
    opt_3 : () => [
        "hp_regeneration_on_battle_start",
        "chance_block_critical",
        "elemental_resistance_light",
        "elemental_resistance_dark",
        "elemental_resistance_lightning",
        "auto_heal_on_enemy_defeat",
    ],
    opt_4 : () => [
        "damage_reflect_on_hit",
        "general_elemental_resistance",
        "defense_buff_adjacent_allies",
        "revive_roll_bonus",
        "elemental_damage_reflect_on_hit",
    ]
}