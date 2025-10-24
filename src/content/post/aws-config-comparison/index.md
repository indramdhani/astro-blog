---
title: "AWS AppConfig, Secrets Manager, Parameter Store, CloudFront"
publishDate: "2025-10-24"
description: "When to use AppConfig, Secrets Manager, and Parameter Store — trade-offs, Lambda patterns, and when CloudFront edge KVS applies."
categories:
  - "aws"
  - "architecture"
tags:
  - "aws"
  - "appconfig"
  - "parameter-store"
  - "secrets-manager"
  - "cloudfront"
---

This article compares four AWS services that are commonly used to store configuration and small pieces of data:

- CloudFront Key-Value Store (edge-focused key-value)
- AWS AppConfig (dynamic configuration & feature flags)
- AWS Secrets Manager (sensitive secrets)
- AWS Systems Manager Parameter Store (key-value configuration)

I'll cover the similarities, the differences, how they work with AWS Lambda, whether they can/should replace Lambda environment variables, and practical recommendations and patterns.

## At a glance — what they share

- All can store small pieces of structured or string data that applications need at runtime.
- Each provides programmatic access (APIs and SDKs) so applications can fetch values at runtime.
- Each integrates with AWS security tooling: IAM for access control and AWS KMS for encryption (some by default, some optionally).
- All support some level of change management (versioning, history, or deployment strategies), but the scope and features differ.

## Purpose and strong suits of each service

- CloudFront Key-Value Store
  - Purpose: Very low-latency, edge-local key-value lookups for CloudFront edge logic (for example, A/B routing, small personalization, edge caching keys).
  - Strong suit: Global edge availability and minimal latency for requests served through CloudFront.
  - Important limitation: Intended for use by CloudFront (edge) functions — not a general-purpose data store for Lambda or backend services. It is optimized for the CDN edge execution environment.

- AWS AppConfig
  - Purpose: Deploying dynamic configuration and feature flags safely with controlled rollout strategies and automatic rollbacks.
  - Strong suit: Deployment strategies (canary, linear, immediate), validators (schema/hosted), and the ability to change configuration without redeploying code.
  - Typical use: Feature flags, tuning parameters, and complex configuration objects that change frequently but are not necessarily secrets.

- AWS Secrets Manager
  - Purpose: Secure storage and lifecycle management of secrets (database credentials, API keys, certificates).
  - Strong suit: Secret rotation support (native integration with RDS and custom rotation lambdas), automatic encryption at rest, and audit trails.
  - Typical use: Any time you need to store sensitive credentials and want built-in rotation & auditing.

- Systems Manager Parameter Store (SSM Parameter Store)
  - Purpose: General-purpose key-value storage for application configuration. Offers both Standard (free) and Advanced (paid) parameters.
  - Strong suit: Simple usage, hierarchical parameter names, encryption with KMS for SecureString parameters.
  - Typical use: Non-sensitive or moderately sensitive configuration (or secrets if you use SecureString, though Secrets Manager is recommended for secrets that need rotation).

## Can you use these with AWS Lambda?

Yes — except for CloudFront Key-Value Store, whose primary access pattern is from CloudFront edge logic.

- Lambda + Secrets Manager
  - Excellent fit. Use Secrets Manager for credentials and secrets. Lambda can fetch secrets at cold start or on demand. Prefer caching (see below) to avoid per-invocation calls and extra latency/cost.
- Lambda + Parameter Store
  - Also a common fit. Use `GetParameter` or `GetParameters` for regular configs; use `SecureString` for encrypted values. Parameter Store is simple and cost-effective for non-rotating values.
- Lambda + AppConfig
  - Great for dynamic configs and feature flags. AppConfig supports safe deployments and rollbacks; use the AppConfig Data API (or SDK helpers) to fetch the latest configuration.
- Lambda + CloudFront Key-Value Store
  - Not suitable as a direct replacement. CloudFront KVS is accessed from CloudFront edge functions (or other CloudFront-specific contexts) and isn't a general store you would query from a normal Lambda function.

## Will these replace Lambda environment variables?

Not entirely. They complement environment variables.

- Use environment variables for:
  - Static values that rarely change.
  - Small flags needed at cold-start for quick bootstrapping.
  - Values you pass to the function via the Lambda console or deployment pipeline.

- Use AppConfig, Parameter Store, or Secrets Manager for:
  - Values that change without deployments (feature toggles, thresholds).
  - Sensitive values (Secrets Manager or SecureString Parameter Store).
  - Shared configuration across many services/functions.
  - Values requiring versioning, rollout, or audit trails.

Typical pattern: keep essential static configuration as environment variables and fetch dynamic or sensitive configuration from one of these services at cold start (cached outside the handler) or on demand.

## Practical integration patterns and guidance

- Cache in Lambda
  - Fetch configuration/secrets during cold-start (module scope, outside the handler), store them in in-memory variables, and reuse for subsequent invocations on the same container.
  - This reduces latency and API request costs.

- Use least privilege IAM
  - Grant each Lambda only the minimum permissions it needs to read specific parameters, secrets, or AppConfig resources.

- Prefer Secrets Manager for secrets that require rotation
  - Secrets Manager has built-in rotation and better auditing semantics than Parameter Store for credentials.

- Use AppConfig for controlled rollouts
  - AppConfig is designed for safe configuration changes with strategies and validators; use it for feature flags or operational toggles.

- Consider latency & cost
  - Fetching values from these services adds latency (and possibly cost). Use caching where appropriate.
  - CloudFront KV is the lowest-latency option but only for edge uses.

- Validation and schema
  - AppConfig supports validation of configuration before deployment; use that to prevent bad configs from reaching production.

## Example snippets (Node.js, AWS SDK v3)

Note: these are minimal examples showing how you might fetch values from the different services. Always add error handling and retries for production.

Get a SecureString parameter from SSM Parameter Store:
```javascript
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({ region: "us-east-1" });

export async function getParameter(name) {
  const cmd = new GetParameterCommand({ Name: name, WithDecryption: true });
  const res = await ssm.send(cmd);
  return res.Parameter?.Value;
}
```

Get a secret from Secrets Manager:
```javascript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient({ region: "us-east-1" });

export async function getSecret(secretId) {
  const cmd = new GetSecretValueCommand({ SecretId: secretId });
  const res = await secretsClient.send(cmd);
  // SecretString contains text secrets; SecretBinary contains binary secrets
  return res.SecretString ?? Buffer.from(res.SecretBinary || "", "base64").toString("utf-8");
}
```

Fetch AppConfig configuration (AppConfig Data API):
```javascript
import { AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand } from "@aws-sdk/client-appconfigdata";

const client = new AppConfigDataClient({ region: "us-east-1" });

export async function getAppConfig(applicationId, environmentId, configurationProfileId) {
  // Start a configuration session
  const session = await client.send(new StartConfigurationSessionCommand({
    ApplicationIdentifier: applicationId,
    EnvironmentIdentifier: environmentId,
    ConfigurationProfileIdentifier: configurationProfileId,
  }));

  // Use the session to get latest configuration
  const token = session.InitialConfigurationToken;
  const res = await client.send(new GetLatestConfigurationCommand({ ConfigurationToken: token }));
  // res.Configuration is a Uint8Array; decode to string. This is a simplified example..
  return res.Configuration ? new TextDecoder().decode(res.Configuration) : null;
}
```

Note: CloudFront Key-Value Store access happens at the CloudFront edge (CloudFront Functions or other CloudFront runtime). You cannot call the CloudFront edge KVS from a regular Lambda the same way you call Secrets Manager or SSM.

## Cost & regional considerations

- Secrets Manager: typically the most expensive of these for storage and per-API request cost, but it includes rotation features.
- Parameter Store: Standard parameters are free; Advanced and high-rate usage incur cost. SecureString parameters involve KMS costs if using customer-managed keys.
- AppConfig: pricing considers hosted configuration size and requests; check current AWS pricing.
- CloudFront KVS: cost characteristics come as part of CloudFront; it is optimized for edge access and global low-latency.

Choose based on the trade-offs between cost, required features (rotation, rollout), and latency.

## Recommendations — quick decision guide

- Secrets (DB passwords, API keys that need rotation): `AWS Secrets Manager`
- Feature flags & frequently changing configs with rollout control: `AWS AppConfig`
- Simple configuration that can be hierarchical and optionally encrypted: `Systems Manager Parameter Store`
- Ultra-low-latency edge lookups tied to CDN behavior: `CloudFront Key-Value Store` (only for CloudFront edge logic)
- Use environment variables for static values or bootstrap values, and fetch dynamic/sensitive values at cold-start and cache them.

## Pitfalls to avoid

- Calling the remote config/secrets API on every Lambda invocation — causes latency and cost. Cache on cold start.
- Over-granting IAM permissions — keep narrow resource scope.
- Storing rotating secrets in Parameter Store without rotation — prefer Secrets Manager for rotation.
- Assuming CloudFront edge stores are available in standard Lambda contexts.

## Closing summary

These four services overlap in that they all provide ways to store and serve data that applications need at runtime, but they are designed for different problems:

- Use Secrets Manager for secrets and rotation,
- Use AppConfig for dynamic configuration and controlled rollouts,
- Use Parameter Store for simple, hierarchical configuration (encrypted if needed),
- Use CloudFront Key-Value Store only for CloudFront edge use cases where global edge latency matters.

In most real systems you’ll use a hybrid approach: environment variables for static bootstrap config, and one or more of these services for dynamic or sensitive values. If you tell me your specific Lambda use case (type of data, update frequency, sensitivity, latency requirements), I can recommend an exact architecture and show a code pattern with caching and IAM policies.
