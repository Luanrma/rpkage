import { generateRandomNumberWithMinAndMaxRange } from "@/engine/utils/utils"; 

interface Multiplier {
    range:Array<number>
    base: number
}

export const levelingByLevelAndBalancers = (playerLevel: number): number => {
    const roll = generateRandomNumberWithMinAndMaxRange(1, 100)
    const baseDmg = multiplier.find(base => (roll >= base.range[0] && roll <= base.range[1])) as Multiplier
    
    if (playerLevel > 60) {
        return Math.ceil(baseDmg.base * (playerLevel / 16))
    }

    const balanceDmgByPlayerLevel = playerLevelBalance
        .find(base => (playerLevel >= base.range[0] && playerLevel <= base.range[1])) as Multiplier

    return Math.ceil(baseDmg.base * (playerLevel / balanceDmgByPlayerLevel.base))
}

const multiplier = [
    { range: [1, 20],   base: 5  },
    { range: [21, 40],  base: 6  },
    { range: [41, 57],  base: 7  },
    { range: [58, 73],  base: 8  },
    { range: [74, 88],  base: 9  },
    { range: [89, 100], base: 10 },
]

const playerLevelBalance = [
    { range: [1, 5],   base: 6  },
    { range: [6, 15],  base: 8  },
    { range: [16, 30], base: 10 },
    { range: [31, 40], base: 12 },
    { range: [41, 50], base: 14 },
    { range: [51, 60], base: 16 },
]