import * as fs from 'fs';
import * as path from 'path';

export interface Logger {
    log(message: string, consoleOutput?: boolean): void;
    error(message: string, consoleOutput?: boolean): void;
    info(message: string, consoleOutput?: boolean): void;
    warn(message: string, consoleOutput?: boolean): void;
    debug(message: string, consoleOutput?: boolean): void;
    close(): void;
}

export interface LoggerOptions {
    scriptName: string;
    enableDebug?: boolean;
    logDir?: string; // caminho customizado para logs
}

export function createLogger(options: LoggerOptions | string): Logger {
    // Suporte para string simples (backward compatibility)
    const config: LoggerOptions = typeof options === 'string'
        ? { scriptName: options }
        : options;

    const {
        scriptName,
        enableDebug = false,
        logDir
    } = config;

    // Determinar diretório de logs
    const baseLogDir = logDir || path.join(__dirname, '..', 'database', 'logs');
    if (!fs.existsSync(baseLogDir)) {
        fs.mkdirSync(baseLogDir, { recursive: true });
    }

    // Criar nome do arquivo de log
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logFileName = `${scriptName}-${timestamp}.log`;
    const logFilePath = path.join(baseLogDir, logFileName);

    // Criar stream de escrita
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

    // Função para escrever no log
    function writeLog(level: string, message: string, consoleOutput = true) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}\n`;

        logStream.write(logMessage);

        if (consoleOutput) {
            const outputStream = level === 'ERROR' ? process.stderr : process.stdout;
            outputStream.write(logMessage);
        }
    }

    // Retornar objeto logger
    return {
        log(message: string, consoleOutput = true) {
            writeLog('INFO', message, consoleOutput);
        },

        error(message: string, consoleOutput = true) {
            writeLog('ERROR', message, consoleOutput);
        },

        info(message: string, consoleOutput = true) {
            writeLog('INFO', message, consoleOutput);
        },

        warn(message: string, consoleOutput = true) {
            writeLog('WARN', message, consoleOutput);
        },

        debug(message: string, consoleOutput = true) {
            if (enableDebug) {
                writeLog('DEBUG', message, consoleOutput);
            }
        },

        close() {
            logStream.end();
        }
    };
}

// Função helper para criar logger rapidamente
export function createScriptLogger(scriptName: string): Logger {
    return createLogger({ scriptName });
}
