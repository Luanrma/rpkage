export interface TranslateMap {
    weapon: Record<string, string>
    armor: Record<string, string>
    weaponTranslations: Record<string, string>
    orb: Record<string, string>
    potion: Record<string, string>
    special_item: Record<string, string>
    skills: Record<string, string>
}

export const translateMap: TranslateMap = {
    weapon: {
        physical_attack: "Ataque Físico",
        magic_attack: "Ataque Mágico",
        physical_attack_plus_dice: "Ataque Físico",
        magic_attack_plus_dice: "Ataque Mágico",
        mp_regeneration_per_turn: "Regeneração de MP por Turno",
        hp_regeneration_per_turn: "Regeneração de HP por Turno",
        life_steal_hp: "Roubo de Vida",
        mana_steal_mp: "Roubo de Mana",
        experience_gain_per_battle: "Ganho de Experiência por Batalha",
        brics_amount: "Quantidade de BRICS",
        elemental_damage_fire: "Dano Elemental Fogo",
        elemental_damage_water: "Dano Elemental Água",
        elemental_damage_nature: "Dano Elemental Natureza",
        elemental_damage_ice: "Dano Elemental Gelo",
        chance_slow_enemy_on_hit: "Chance de Desacelerar Inimigos",
        bonus_damage_vs_boss_or_higher: "Dano Adicional contra BOSS",
        chance_critical_hit: "Chance de Crítico",
        skill_point_bonus: "Bônus de Perícia",
        elemental_damage_light: "Dano Elemental Luz",
        elemental_damage_dark: "Dano Elemental Escuridão",
        elemental_damage_lightning: "Dano Elemental Raio",
        chance_consecutive_attack: "Chance de Ataque Consecutivo",
        chance_better_drop_quality: "Chance de Melhorar Qualidade do Drop",
        increased_elemental_damage: "Dano Elemental Aumentado",
        damage_buff_adjacent_allies: "Buff de Dano aos Aliados Adjacentes"
    },
    
    armor: {
        physical_defense: "Defesa Física",
        magic_defense: "Defesa Mágica",
        additional_hp: "HP Adicional",
        additional_mp: "MP Adicional",
        hp_regeneration_per_hit_taken: "Regeneração de HP por Dano Recebido",
        mp_regeneration_per_hit_taken: "Regeneração de MP por Dano Recebido",
        elemental_resistance_fire: "Resistência Elemental Fogo",
        elemental_resistance_water: "Resistência Elemental Água",
        elemental_resistance_nature: "Resistência Elemental Natureza",
        elemental_resistance_ice: "Resistência Elemental Gelo",
        brics_amount: "Quantidade de BRICS",
        hp_regeneration_on_battle_start: "Regeneração de HP no Início da Batalha",
        chance_block_critical: "Chance de Bloquear Crítico",
        elemental_resistance_light: "Resistência Elemental Luz",
        elemental_resistance_dark: "Resistência Elemental Escuridão",
        elemental_resistance_lightning: "Resistência Elemental Raio",
        auto_heal_on_enemy_defeat: "Cura Automática ao Derrotar Inimigo",
        damage_reflect_on_hit: "Reflexão de Dano ao Ser Atacado",
        general_elemental_resistance: "Resistência Elemental Geral",
        defense_buff_adjacent_allies: "Buff de Defesa aos Aliados Adjacentes",
        revive_roll_bonus: "Bônus na Rolagem de Reviver",
        elemental_damage_reflect_on_hit: "Reflexão de Dano Elemental ao Ser Atacado",
        skill_point_bonus: "Bônus de Ponto de Perícia"
    },

    weaponTranslations: {
        two_hands_sword: "Espada 2M",
        one_hand_sword: "Espada 1M",
        two_hands_axe: "Machado 2M",
        two_hands_spear: "Lança 2M",
        two_hands_bow: "Arco 2M",
        one_hand_dagger: "Adaga 1M",
        one_hand_knife: "Faca 1M",
        one_hand_staff: "Cajado 1M",
        two_hands_staff: "Cajado 2M",
        two_hands_firearm: "Arma de Fogo 2M",
        one_hand_firearm: "Arma de Fogo 1M",
        one_hand_hammer: "Martelo 1M",
        one_hand_club: "Clava 1M",
        two_hands_hammer: "Martelo 2M",
        two_hands_club: "Clava 2M",
        one_hand_spellbook: "Livro de Feitiços 1M"
    },

    orb: {
        black_orb: "ORB Negra",
        green_orb: "ORB Verde",
        blue_orb: "ORB Azul",
        red_orb: "ORB Vermelha",
        special_orb: "ORB Especial",
        summon_orb: "ORB de Invocação",
    },

    potion: {
        hp_potion: "Potion HP",    
        mp_potion: "Potion MP",    
        lunchbox: "Marmita",     
        heal_potion: "Potion de Cura",  
        full_mp_potion: "Potion de MP Completo",
        full_hp_potion: "Potion de HP Completo",
        special_potion: "Potion Especial",
    },

    special_item: {
        special_item: "Item Especial"
    },

    skills: {
        Perception: "Percepção",
        Athletics: "Atletismo",
        Intimidation: "Intimidação",
        Persuasion: "Persuasão",
        Stealth: "Furtividade",
        Medicine: "Medicina",
        Knowledge: "Conhecimento",
        History: "História",
    },
};