export function formatDateTime(dateInput, withTime = true) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return withTime
        ? `${day}/${month}/${year} ${hours}:${minutes}`
        : `${day}/${month}/${year}`;
}
