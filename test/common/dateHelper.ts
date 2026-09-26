export function datePartsFromToday(daysAgo: number) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);

    return {
        day: String(date.getDate()).padStart(2, '0'),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        monthName: date.toLocaleString('en-GB', { month: 'long' }),
        year: String(date.getFullYear()),
    };
}

export function formatDate(date: Date) {
    return {
        day: date.getDate().toString(),
        month: (date.getMonth() + 1).toString(),
        monthName: date.toLocaleString('en-GB', { month: 'long' }),
        year: date.getFullYear().toString(),
    };
}
