export const safeNum = (val: any): number => {
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    return parseInt(cleaned, 10) || 0;
};

export const toHours = (sec: number) => {
    if (sec < 60) return `${sec} сек`;
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    return hours > 0 ? `${hours} год ${minutes} хв` : `${minutes} хв`;
};

export const formatDate = (timestamp: any) => {
    const t = safeNum(timestamp);
    if (t === 0) return 'Невідомо';
    return new Date(t * 1000).toLocaleDateString('uk-UA', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};