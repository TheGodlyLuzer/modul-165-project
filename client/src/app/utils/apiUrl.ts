export const apiUrl = (): string => {
    console.log("GETTING API URL");
    if (typeof window === 'undefined') {
        console.log("GETTING API URL - ON SERVER");
        console.log(process.env.API_URL_SERVER ?? 'SALKDJAéLSDJALéSJDL')
        return process.env.API_URL_SERVER ?? 'http://express-backend:3001/api';
    } else {
        console.log("GETTING API URL - ON CLIENT");
        return process.env.NEXT_PUBLIC_API_URL ?? '';
    }
};
