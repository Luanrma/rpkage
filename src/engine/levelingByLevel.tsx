import { generateRandomNumberWithMinAndMaxRange } from "@/engine/utils/utils"; 

export const levelingByLevel = (playerLevel: number): number => {
    const maxRoll = playerLevel
    const minRoll = ((playerLevel - 10) <= 0) ? 1 : playerLevel - 10
    return generateRandomNumberWithMinAndMaxRange(minRoll, maxRoll)
}