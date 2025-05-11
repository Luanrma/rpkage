export type AttributeDetails = {
    base: string;
    extra: string;
    total: string;
}

export type AttributeBlock = {
    physicalAttack: AttributeDetails;
    magicAttack: AttributeDetails;
    physicalDefense: AttributeDetails;
    magicDefense: AttributeDetails;
    hp: AttributeDetails;
    mp: AttributeDetails;
};

export type ExpertiseBlock = {
    perception: string;
    athletics: string;
    intimidation: string;
    persuasion: string;
    stealth: string;
    medicine: string;
    knowledge: string;
    history: string;
};

export type OrbOfEssence = {
    type: string;
    hability: string | null;
    cost: string;
    description: string | null;
};

export type PassiveSkill = {
    name: string;
    effect: string;
};

export type SheetModelKageForCharacter = {
    name: string;
    race: string;
    life: string;
    energy: string;
    class: string;
    level: string;
    xp: string;
    attributes: AttributeBlock;
    expertise: ExpertiseBlock;
    orbs: OrbOfEssence[];
    passiveSkills: PassiveSkill[];
};
