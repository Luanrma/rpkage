export const generateRandomNumberWithMinAndMaxRange = (minRange: number, maxRange: number): number => {
    if (maxRange <= 0) {
        throw new Error("maxRange deve ser maior que zero.");
    }
    return Math.floor(Math.random() * maxRange) + minRange;
};