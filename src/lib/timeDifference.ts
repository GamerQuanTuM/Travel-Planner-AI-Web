function parseTime(timeString: string) {
    const [time, period] = timeString.split(/(AM|PM)/);
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes: minutes || 0 };
}

export function timeDifference(start: string, end: string) {
    const startTime = parseTime(start);
    const endTime = parseTime(end);

    let startMinutes = startTime.hours * 60 + startTime.minutes;
    let endMinutes = endTime.hours * 60 + endTime.minutes;

    let diff = endMinutes - startMinutes;
    if (diff < 0) diff += 24 * 60; // Handle overnight times

    const diffHours = Math.floor(diff / 60);
    const diffMinutes = diff % 60;

    if (diffHours <= 0) {
        return `${diffMinutes} minutes`
    }

    if (diffMinutes <= 0) {
        return `${diffHours} hours`
    }

    return `${diffHours} hours and ${diffMinutes} minutes`;
}

