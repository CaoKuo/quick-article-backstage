export default (date: any, fmt = 'YYYY-MM-DD HH:mm:ss'): string => {
    if (!date) {
        throw new Error('invalid date');
    }
    if (typeof date === 'string') {
        date = new Date(date.replace(/-/g, '/'));
    }
    if (typeof date === 'number') {
        date = new Date(date);
    }
    const o: Record<string, any> = {
        'M+': (date.getMonth() as number) + 1,
        'D+': date.getDate(),
        'h+': (date.getHours()) % 12 === 0 ? 12 : (date.getHours()) % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor(((date.getMonth() as number) + 3) / 3),
        S: date.getMilliseconds(),
    };
    const week: Record<string, any> = {
        0: '\u65e5',
        1: '\u4e00',
        2: '\u4e8c',
        3: '\u4e09',
        4: '\u56db',
        5: '\u4e94',
        6: '\u516d',
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(/(Y+)/, function (match): string {
            return String(date.getFullYear()).substr(4 - match.length);
        });
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(/(E+)/, function (match): string {
            return (
                (match.length > 2 ? (match.length > 3 ? '\u661f\u671f' : '\u5468') : '') +
                String(week[date.getDay()])
            );
        });
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(new RegExp('(' + k + ')'), function (match): string {
                return match.length === 1 ? o[k] : ('00' + String(o[k])).substr(String(o[k]).length);
            });
        }
    }
    return fmt;
};
