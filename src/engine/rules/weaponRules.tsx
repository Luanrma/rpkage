export const weaponRules: Record<string, () => string[]> = {
    opt_1 : () => [
        "physical_attack",
        "magic_attack",
        "physical_attack_plus_dice",
        "magic_attack_plus_dice",
    ],
    opt_2: () => [
        "mp_regeneration_per_turn",
        "hp_regeneration_per_turn",
        "life_steal_hp",
        "mana_steal_mp",
        "experience_gain_per_battle",
        "brics_amount",
        "elemental_damage_fire",
        "elemental_damage_water",
        "elemental_damage_nature",
        "elemental_damage_ice",
    ],
    opt_3: () => [
        "chance_slow_enemy_on_hit",
        "bonus_damage_vs_boss_or_higher",
        "critical_hit_chance",
        "skill_point_bonus",
        "elemental_damage_light",
        "elemental_damage_dark",
        "elemental_damage_lightning",
    ],
    opt_4: () => [
        "chance_consecutive_attack",
        "chance_better_drop_quality",
        "increased_elemental_damage",
        "damage_buff_adjacent_allies",
    ]
}