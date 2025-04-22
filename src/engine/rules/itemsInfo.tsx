export const itemsInfo = {
    rarity_table: {
        common: 1,
        uncommon: 2,
        rare: 3,
        epic: 4,
        legendary: 5
    } as Record<string, number>,
    
    items_type: {
        armor: 1,
        weapon: 2,
        item: 3,
        orb: 4,
        brics: 5,
        special_item: 6
    } as Record<string, number>,

    armor_parts: {
        helm: 1,
        chest: 2,
        gloves: 3,
        pants: 4,
        boots: 5,
    } as Record<string, number>,

    weapon_types: {
        two_hands_sword: 1,        // Espada 2M
        one_hand_sword: 2,         // Espada 1M
        two_hands_axe: 3,          // Machado 2M
        two_hands_spear: 4,        // Lança 2M
        two_hands_bow: 5,          // Arco 2M
        one_hand_dagger: 6,        // Adaga 1M
        one_hand_knife: 7,         // Faca 1M
        one_hand_staff: 8,         // Cajado 1M
        two_hands_staff: 9,        // Cajado 2M
        two_hands_firearm: 10,     // Arma de Fogo 2M
        one_hand_firearm: 11,      // Arma de Fogo 1M
        one_hand_hammer: 12,       // Martelo 1M
        one_hand_club: 13,         // Clava 1M
        two_hands_hammer: 14,      // Martelo 2M
        two_hands_club: 15,        // Clava 2M
        one_hand_spellbook: 16     // Livro de Feitiços 1M
    } as Record<string, number>
}