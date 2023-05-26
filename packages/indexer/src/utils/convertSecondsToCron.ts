export function convertSecondsToCron(seconds: number): string {
    const targetTime = Date.now() + seconds * 1000;

// Convert the target time to a Date object
    const targetDate = new Date(targetTime);

// Extract the individual components (second, minute, hour, day, month, year) from the target date
    const targetSecond = targetDate.getSeconds();
    const targetMinute = targetDate.getMinutes();
    const targetHour = targetDate.getHours();
    const targetDay = targetDate.getDate();
    const targetMonth = targetDate.getMonth() + 1; // Months are zero-based, so add 1

// Format the individual components into a cron expression
    return `${targetSecond} ${targetMinute} ${targetHour} ${targetDay} ${targetMonth} *`;
}

