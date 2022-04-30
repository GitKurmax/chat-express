const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const ENV = process.env.NODE_ENV

function getLogger(module) {
    const path = module.filename.split('/').slice(-2).join('/')
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    return createLogger({
        level: ENV === 'development' ? 'debug' : 'error',
        format: combine(
            label({label: path}),
            timestamp(),
            colorize(),
            myFormat
        ),
        transports: [
            new transports.Console()
        ]
    })
}

module.exports = getLogger