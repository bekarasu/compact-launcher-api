export default class HttpException extends Error {
    statusCode: number;
    message: string;
    error: string | null | object;

    constructor(statusCode: number, message: string, error?: string | object) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error || null;
    }
}