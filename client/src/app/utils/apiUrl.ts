export const apiUrl = (): string => {
    if (typeof window === 'undefined') {
        return process.env.API_URL_SERVER ?? 'http://express-backend:3001/api';
    } else {
        return process.env.NEXT_PUBLIC_API_URL ?? '';
    }
};
