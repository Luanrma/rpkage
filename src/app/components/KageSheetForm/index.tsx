'use client';

import { AttributeBlock, ExpertiseBlock, OrbOfEssence, PassiveSkill, SheetModelKageForCharacter } from '@/app/(private)/character/sheetModel';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
    sheet?: SheetModelKageForCharacter;
    onChange: (sheet: SheetModelKageForCharacter) => void;
};

const expertiseDescriptions: Record<keyof ExpertiseBlock, string> = {
    perception: 'Detectar ameaças ou detalhes ocultos.',
    athletics: 'Força física bruta, como correr ou escalar.',
    intimidation: 'Ameaçar ou pressionar outros.',
    persuasion: 'Convencer de forma amigável.',
    stealth: 'Mover-se silenciosamente ou se esconder.',
    medicine: 'Curar ferimentos e reconhecer doenças.',
    knowledge: 'Saber geral sobre o mundo.',
    history: 'Fatos e eventos do passado.',
};

export default function KageSheetForm({ sheet, onChange }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 5;
    const [form, setForm] = useState<SheetModelKageForCharacter>(
        sheet || {
            name: '',
            race: '',
            life: '0',
            energy: '0',
            class: '',
            level: '0',
            xp: '0',
            attributes: {
                physicalAttack: { base: "0", extra: "0", total: "0" },
                magicAttack: { base: "0", extra: "0", total: "0" },
                physicalDefense: { base: "0", extra: "0", total: "0" },
                magicDefense: { base: "0", extra: "0", total: "0" },
                hp: { base: "0", extra: "0", total: "0" },
                mp: { base: "0", extra: "0", total: "0" },
            },
            expertise: {
                perception: '0',
                athletics: '0',
                intimidation: '0',
                persuasion: '0',
                stealth: '0',
                medicine: '0',
                knowledge: '0',
                history: '0',
            },
            orbs: [],
            passiveSkills: [],
        }
    );

    useEffect(() => {
        onChange(form);
    }, [form]);

    const handleChange = (path: string, value: string) => {
        const newForm = { ...form };
        const keys = path.split('.');

        let obj: any = newForm;
        while (keys.length > 1) {
            obj = obj[keys.shift()!];
        }
        obj[keys[0]] = value;

        setForm(newForm);
    };

    const handleAttributes = (attribute: keyof AttributeBlock, field: 'base' | 'extra', value: string) => {
        const newForm = { ...form };
        const attr = newForm.attributes[attribute];

        attr[field] = value;
        attr.total = (parseInt(attr.base || '0') + parseInt(attr.extra || '0')).toString();

        setForm(newForm);
    };

    const addOrb = () => {
        if (form.orbs.length >= 5) return;
        setForm({
            ...form,
            orbs: [...form.orbs, { type: '', hability: '', cost: '', description: '' }],
        });
    };

    const updateOrb = (index: number, field: keyof OrbOfEssence, value: string) => {
        const updated = [...form.orbs];
        updated[index][field] = value;
        setForm({ ...form, orbs: updated });
    };

    const removeOrb = (index: number) => {
        const updated = [...form.orbs];
        updated.splice(index, 1);
        setForm({ ...form, orbs: updated });
    };

    const addPassiveSkill = () => {
        setForm({
            ...form,
            passiveSkills: [...form.passiveSkills, { name: '', effect: '' }],
        });
    };

    const updatePassiveSkill = (index: number, field: keyof PassiveSkill, value: string) => {
        const updated = [...form.passiveSkills];
        updated[index][field] = value;
        setForm({ ...form, passiveSkills: updated });
    };

    const removePassiveSkill = (index: number) => {
        const updated = [...form.passiveSkills];
        updated.splice(index, 1);
        setForm({ ...form, passiveSkills: updated });
    };

    const sections = [
        (
            <Section key="general">
                <h3>General Info</h3>
                <Row>
                    <label>Name</label>
                    <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                </Row>
                <Row>
                    <label>Race</label>
                    <input value={form.race} onChange={(e) => handleChange('race', e.target.value)} />
                </Row>
                <GroupedRow>
                    <div>
                        <label>Class</label>
                        <input value={form.class} onChange={(e) => handleChange('class', e.target.value)} />
                    </div>
                </GroupedRow>
                <GroupedRow>
                    <div>
                        <label>Life</label>
                        <input type="number" min="0" value={form.life} onChange={(e) => handleChange('life', e.target.value)} />
                    </div>
                    <div>
                        <label>Energy</label>
                        <input type="number" min="0" value={form.energy} onChange={(e) => handleChange('energy', e.target.value)} />
                    </div>
                </GroupedRow>
                <GroupedRow>
                    <div>
                        <label>Level</label>
                        <input type="number" min="0" value={form.level} onChange={(e) => handleChange('level', e.target.value)} />
                    </div>
                    <div>
                        <label>XP</label>
                        <input type="number" min="0" value={form.xp} onChange={(e) => handleChange('xp', e.target.value)} />
                    </div>
                </GroupedRow>
            </Section>
        ),
        (
            <Section key="attributes">
                <h3>Attributes</h3>
                {Object.entries(form.attributes).map(([key, attr]) => (
                    <AttributeGroup key={key}>
                        <h4>{key}</h4>
                        <div className="fields">
                            <div>
                                <label>Base</label>
                                <input
                                    type="number" min="0"
                                    placeholder="Base"
                                    value={attr.base}
                                    onChange={(e) =>
                                        handleAttributes(key as keyof AttributeBlock, 'base', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label>Extra</label>
                                <input
                                    type="number" min="0"
                                    placeholder="Extra"
                                    value={attr.extra}
                                    onChange={(e) =>
                                        handleAttributes(key as keyof AttributeBlock, 'extra', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label>Total</label>
                                <input
                                    className="pointer-events-none select-none"
                                    type="number" min="0"
                                    placeholder="Total"
                                    value={attr.total}
                                    readOnly
                                />
                            </div>
                        </div>
                    </AttributeGroup>
                ))}
            </Section>
        ),
        (
            <Section key="expertise">
                <h3>Expertise</h3>
                {Object.entries(form.expertise).map(([key, value]) => (
                    <ExpertiseRow key={key}>
                        <label>
                            <input
                                type="number"
                                min="0"
                                value={value}
                                onChange={(e) => handleChange(`expertise.${key}`, e.target.value)}
                            />
                            {key}
                            <DescriptionText>{expertiseDescriptions[key as keyof ExpertiseBlock]}</DescriptionText>
                            <TooltipIcon
                                title={expertiseDescriptions[key as keyof ExpertiseBlock]}
                                aria-label="Description"
                            >
                                ?
                            </TooltipIcon>
                        </label>
                    </ExpertiseRow>
                ))}
            </Section>
        ),
        (
            <Section key="orbs">
                <h3>Orbs of Essence</h3>
                {form.orbs?.map((orb, idx) => (
                    <OrbContainer key={idx}>
                        <input
                            placeholder="Orb Type"
                            value={orb.type}
                            onChange={(e) => updateOrb(idx, 'type', e.target.value)}
                        />
                        <input
                            placeholder="Orb Hability"
                            value={orb.hability || ''}
                            onChange={(e) => updateOrb(idx, 'hability', e.target.value)}
                        />
                        <input
                            placeholder="Orb Cost"
                            value={orb.cost}
                            onChange={(e) => updateOrb(idx, 'cost', e.target.value)}
                        />
                        <textarea
                            placeholder="Description"
                            value={orb.description || ''}
                            onChange={(e) => updateOrb(idx, 'description', e.target.value)}
                        />
                        <button type="button" onClick={() => removeOrb(idx)}>Remove</button>
                    </OrbContainer>
                ))}
                {form.orbs?.length < 5 && (
                    <ButtonAddOrb type="button" onClick={addOrb}>Add Orb</ButtonAddOrb>
                )}
            </Section>
        ),
        (
            <Section key="passives">
                <h3>Passive Skills</h3>
                {form.passiveSkills.map((skill, idx) => (
                    <SkillContainer key={idx}>
                        <input
                            placeholder="Skill Name"
                            value={skill.name}
                            onChange={(e) => updatePassiveSkill(idx, 'name', e.target.value)}
                        />
                        <textarea
                            placeholder="Effect"
                            value={skill.effect}
                            onChange={(e) => updatePassiveSkill(idx, 'effect', e.target.value)}
                        />
                        <button type="button" onClick={() => removePassiveSkill(idx)}>Remove</button>
                    </SkillContainer>
                ))}
                <ButtonAddSkill type="button" onClick={addPassiveSkill}>Add Passive Skill</ButtonAddSkill>
            </Section>
        )
    ];

    return (
        <SheetContainer>
            {sections[currentStep]}

            <hr/>
            <Navigation>
                <button
                    onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                    disabled={currentStep === 0}
                >
                    <ChevronLeft/>
                </button>
                <span>{currentStep + 1} de {totalSteps}</span>
                <button
                    onClick={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))}
                    disabled={currentStep === totalSteps - 1}
                >
                    <ChevronRight/>
                </button>
            </Navigation>
        </SheetContainer>
    );
}

const SheetContainer = styled.div`
    margin-top: 2rem;
    background-color: #1e1e1e;
    color: #f0f0f0;
    padding: 2rem;
    font-family: 'Courier New', Courier, monospace;
    border: 2px solid #7e57c2;
    border-radius: 12px;
`;

const Section = styled.section`
    margin-bottom: 2rem;

    h3 {
        border-bottom: 2px solid #4caf50;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.8rem;

    label {
        font-weight: bold;
        margin-bottom: 0.2rem;
    }

    input {
        background: #2e2e2e;
        color: white;
        padding: 0.5rem;
        border: 1px solid #444;
        border-radius: 4px;
    }
`;

const Navigation = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;

    button {
        padding: 0.5rem 1rem;
        background-color: #7e57c2;
        border: none;
        color: white;
        border-radius: 6px;
        cursor: pointer;

        &:disabled {
            background-color: #444;
            cursor: not-allowed;
        }
    }

    span {
        font-size: 0.9rem;
        color: #ccc;
    }
`;

const ExpertiseRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    input {
        width: 60px;
        margin-right: 0.5rem;
        background: #2e2e2e;
        color: white;
        padding: 0.3rem;
        border: 1px solid #444;
        border-radius: 4px;
        text-align: center;
    }

    label {
        min-width: 100px;
        font-weight: bold;
        margin-right: 1rem;
        text-transform: capitalize;
    }

    small {
        color: #aaa;
        font-size: 0.85rem;
    }
`;

const DescriptionText = styled.small`
    display: inline;
    margin-left: 0.5rem;
    font-size: 0.75rem;
    color: #aaa;

    @media (max-width: 720px) {
        display: none;
    }
`;

const TooltipIcon = styled.span`
    display: none;
    margin-left: 0.5rem;
    background-color: #555;
    color: white;
    font-weight: bold;
    padding: 0 0.4rem;
    border-radius: 50%;
    cursor: pointer;

    @media (max-width: 720px) {
        display: inline-block;
    }

    &:hover::after {
        content: attr(title);
        position: absolute;
        background-color: #333;
        color: #fff;
        font-size: 0.7rem;
        padding: 0.5rem;
        border-radius: 5px;
        top: 100%;
        left: 0;
        white-space: nowrap;
        z-index: 10;
    }
`;

const GroupedRow = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    > div {
        background: #2a2a2a;
        flex: 1;
    }

    label {
        font-size: 0.8rem;
        color: #aaa;
        display: block;
        text-align: center;
    }
        
    input {
        background: #1f1f1f;
        color: #fff;
        border: 1px solid #444;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        border-radius: 4px;
        padding: 0.3rem;
        text-align: center;
    }
`;

const AttributeGroup = styled.div`
    background: #2a2a2a;
    padding: 0.5rem;
    border: 1px solid #555;
    border-radius: 6px;
    margin-bottom: 1rem;

    h4 {
        text-transform: capitalize;
        margin-bottom: 0.5rem;
        color: #ddd;
    }

    label {
        font-size: 0.8rem;
        color: #aaa;
        display: block;
        text-align: center;
    }

    .fields {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    .fields input {
        background: #1f1f1f;
        color: #fff;
        border: 1px solid #444;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        border-radius: 4px;
        padding: 0.3rem;
        text-align: center;
    }

    .fields > div {
        flex: 1 1 30%;
        min-width: 3rem;
        display: flex;
        flex-direction: column;
    }
`;

const OrbContainer = styled.div`
    background: #2a2a2a;
    padding: 1rem;
    border: 1px dashed #7e57c2;
    margin-bottom: 1rem;
    border-radius: 8px;

    input, textarea {
        width: 100%;
        margin-bottom: 0.5rem;
        background: #1f1f1f;
        color: #e0e0e0;
        padding: 0.5rem;
        border: 1px solid #555;
        border-radius: 4px;
    }

    button {
        background: #c62828;
        color: white;
        padding: 0.3rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background: #a31e1e;
        }
    }
`;

const ButtonAddOrb = styled.button`
    background-color: #7e57c2;
    border: 2px solid #333;     /* borda escura como o restante dos inputs */
    border-radius: 6px;
    padding: 8px 12px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color:rgb(85, 56, 134);
    }
`;

const SkillContainer = styled.div`
    background: #2a2a2a;
    padding: 1rem;
    border: 1px dashed #7e57c2;
    margin-bottom: 1rem;
    border-radius: 8px;

    input, textarea {
        width: 100%;
        margin-bottom: 0.5rem;
        background: #1f1f1f;
        color: #e0e0e0;
        padding: 0.5rem;
        border: 1px solid #555;
        border-radius: 4px;
    }

    button {
        background: #c62828;
        color: white;
        padding: 0.3rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background: #a31e1e;
        }
    }
`;

const ButtonAddSkill = styled.button`
     background-color: #7e57c2;
    border: 2px solid #333;     /* borda escura como o restante dos inputs */
    border-radius: 6px;
    padding: 8px 12px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color:rgb(85, 56, 134);
    }
`;
