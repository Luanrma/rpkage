export const generateRandomNumberWithMinAndMaxRange = (minRange: number, maxRange: number): number => {
    if (maxRange <= 0 || minRange <= 0) {
        throw new Error("The range must be greater than zero!")
    }

    if (minRange > maxRange) {
        throw new Error("The minimun cannot be greater than the maximum range!")
    }

    return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange
}