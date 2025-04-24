export default {
    getRandomRarity: () => {
        const roll = Math.floor(Math.random() * 100) + 1;

        switch (true) {
            case roll <= 35: return "common"
            case roll <= 60: return "uncommon"
            case roll <= 80: return "rare"
            case roll <= 93: return "epic"
            case roll <= 100: return "legendary"
            default: return "common"
        }
    }
}