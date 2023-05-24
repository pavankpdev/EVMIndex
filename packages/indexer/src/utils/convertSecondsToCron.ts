export function convertSecondsToCron(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;

    console.log(`minutes: ${minutes}, remainderSeconds: ${remainderSeconds}`)

    if (minutes === 0) {
        return `${remainderSeconds} * * * * *`;
    } else {
        return `${remainderSeconds} ${minutes} * * * *`;
    }
}

