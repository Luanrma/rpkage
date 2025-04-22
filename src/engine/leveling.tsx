import { generateRandomNumberWithMinAndMaxRange } from "@/app/utils/utils"; 

export const leveling = (level: number): number => {
    let value = generateRandomNumberWithMinAndMaxRange(2, 10);

    if (value > 5 && Math.random() > 0.5) value = Math.floor(Math.random() * 5) + 1;
    if (value > 7 && Math.random() > 0.6) value = Math.floor(Math.random() * 7) + 1;
    if (value > 9 && Math.random() > 0.7) value = Math.floor(Math.random() * 9) + 1;

    return Math.ceil(value * (level / 10))
}