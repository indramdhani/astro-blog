---
title: "Structured Logging for Node.js and AWS Lambda"
publishDate: "2026-11-28"
description: "JSON logging with correlation IDs, log levels and rotation, with Winston and AWS Lambda implementations and best practices."
tags:
  - "logging"
  - "aws"
---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Structured format** | JSON for machine parsing, consistent timestamps |
| **Contextual information** | Request IDs, correlation IDs, service metadata |
| **Consistency** | Same format across services, environments |
| **Log aggregation** | Centralized collection (CloudWatch, ELK, Loki) |
| **Retention planning** | Size limits, rotation, tiered storage |
| **Development integration** | Logging as first-class concern |

## Log Levels

| Level | Use Case |
|-------|----------|
| `error` | Exceptions, failed operations, system errors |
| `warn` | Degraded performance, deprecated usage, near-limits |
| `info` | Business events, state changes, requests |
| `debug` | Detailed flow, variable values, troubleshooting |

## Node.js Implementation (Winston)

### Service Logger Class
```javascript
const winston = require('winston');
const { format } = winston;

class Logger {
  constructor(serviceName, options = {}) {
    this.logger = winston.createLogger({
      level: options.logLevel || 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      defaultMeta: {
        service: serviceName,
        environment: process.env.NODE_ENV || 'development'
      },
      transports: [
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: '10m',
          maxFiles: '7d'
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: '10m',
          maxFiles: '7d'
        })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple())
      }));
    }
  }

  log(level, message, context = {}) {
    this.logger.log(level, message, {
      ...context,
      requestId: context.requestId || this.getRequestId(),
      timestamp: new Date().toISOString()
    });
  }

  // Convenience methods: error, warn, info, debug
}
```

### Express Middleware
```javascript
const requestLoggingMiddleware = (logger) => (req, res, next) => {
  const requestId = req.headers['x-request-id'] || logger.getRequestId();
  global.requestId = requestId;
  
  logger.info('Incoming request', { requestId, method: req.method, url: req.url });
  
  res.on('finish', () => {
    logger.info('Request completed', {
      requestId,
      statusCode: res.statusCode,
      duration: Date.now() - startTime
    });
  });
  
  next();
};
```

## AWS Lambda Implementation

### Lambda Logger Class
```javascript
class LambdaLogger {
  constructor(options = {}) {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      ),
      defaultMeta: {
        service: options.service || 'lambda-service',
        environment: process.env.NODE_ENV,
        version: process.env.AWS_LAMBDA_FUNCTION_VERSION
      }
    });
    
    this.logger.add(new winston.transports.Console({
      format: format.combine(format.colorize(), format.printf(this.formatMessage.bind(this)))
    }));
  }

  setLambdaContext(context, event) {
    this.correlationId = 
      event?.headers?.['x-correlation-id'] ||
      event?.requestContext?.requestId ||
      context.awsRequestId;

    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      correlationId: this.correlationId,
      awsRequestId: context.awsRequestId,
      functionName: context.functionName,
      memoryLimitInMB: context.memoryLimitInMB
    };
  }

  log(level, message, context = {}) {
    const memory = process.memoryUsage();
    this.logger.log(level, message, {
      ...context,
      metrics: {
        memoryUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
        memoryTotalMB: Math.round(memory.heapTotal / 1024 / 1024),
        remainingTimeMs: this.lambdaContext?.getRemainingTimeInMillis()
      }
    });
  }
}
```

### Wrapper for Lambda Handlers
```javascript
const withLogging = (handler, loggerOptions = {}) => {
  const logger = new LambdaLogger(loggerOptions);
  
  return async (event, context) => {
    logger.setLambdaContext(context, event);
    logger.logColdStart?.();
    
    if (event.httpMethod) logger.logApiGatewayEvent(event);
    
    try {
      const result = await handler(event, context, logger);
      logger.info('Completed', { statusCode: result?.statusCode });
      return result;
    } catch (error) {
      logger.error('Failed', error);
      throw error;
    }
  };
};
```

## Key Features

| Feature | Node.js | Lambda |
|---------|---------|--------|
| JSON output | ✅ | ✅ |
| Request correlation | ✅ | ✅ |
| Error stack traces | ✅ | ✅ |
| Log rotation | ✅ (file) | N/A (CloudWatch) |
| Child loggers | ✅ | N/A |
| Express middleware | ✅ | N/A |
| Cold start detection | N/A | ✅ |
| Memory metrics | N/A | ✅ |
| API Gateway logging | N/A | ✅ |
| Sensitive data redaction | N/A | ✅ |

## Best Practices

1. **Always include context** — requestId, userId, correlationId
2. **Use structured fields** — not string concatenation
3. **Separate error logs** — easier alerting
4. **Redact sensitive data** — tokens, PII, passwords
5. **Sample high-volume debug** — avoid log cost explosion
6. **Correlate across services** — pass correlationId in headers
7. **Monitor log volume** — alert on anomalies

## Related

- [Importance of Logging](/posts/importance-of-logging/) — Why logging matters and how to plan it
