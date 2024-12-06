function formatDate(dateString: string): string {
    // format the date to 10 Nov 24
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-ZA', options);
}

export const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const formatLongDate = (date: string) => {
    return new Date(date)
        .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        .toUpperCase();
};

export function formatReferenceCode(referenceCode: string): string {
    return `HLT-${referenceCode.slice(0, 5)}${referenceCode.slice(-4)}`;
}

// format amount to ZAR
function formatAmount(amount: number): string {
    return amount.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
}

export { formatDate, formatAmount };