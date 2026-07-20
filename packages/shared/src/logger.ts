import picocolors from 'picocolors';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
    private prefix: string;

    constructor(prefix = '[mv3-forge]') {
        this.prefix = prefix;
    }

    private format(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const levelColors = {
            debug: picocolors.blue,
            info: picocolors.green,
            warn: picocolors.yellow,
            error: picocolors.red,
        };

        return `${picocolors.gray(`[${timestamp}]`)} ${levelColors[level](`[${level.toUpperCase()}]`)} ${this.prefix} ${message}`;
    }

    debug(message: string): void {
        console.log(this.format('debug', message));
    }

    info(message: string): void {
        console.log(this.format('info', message));
    }

    warn(message: string): void {
        console.log(this.format('warn', message));
    }

    error(message: string): void {
        console.error(this.format('error', message));
    }

    success(message: string): void {
        console.log(`${picocolors.green('✔')} ${message}`);
    }

    step(message: string): void {
        console.log(`${picocolors.cyan('→')} ${message}`);
    }
}