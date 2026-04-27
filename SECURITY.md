# SECURITY.md

## 1. Scope

This file defines baseline security expectations for this project (web app/API/SPA/backend).

- Production-focused implementation baseline
- Intended for daily engineering and PR reviews
- Not a full compliance framework or long-form security guide

---

## 2. Security Principles

- Enforce controls server-side (never trust client-side checks alone)
- Least privilege by default
- Deny by default on protected actions
- Validate all untrusted input
- Authorize every protected resource access
- Do not leak secrets or internals in responses/logs
- Log security-relevant events safely and consistently

---

## 3. Request Lifecycle Checklist

Use this as a quick review path for every endpoint:

`Client -> Edge/HTTPS/Proxy -> Route -> Authentication -> Authorization -> Validation -> Controller/Service -> Database/External Service -> Response -> Logging/Monitoring`

Checklist:

- [ ] Edge/proxy assumptions are correct (`trust proxy`, TLS termination, headers)
- [ ] Authentication is enforced where required
- [ ] Authorization is explicit (role/ownership/tenant)
- [ ] Body/query/params are validated
- [ ] External and DB operations are bounded/safe
- [ ] Response excludes sensitive/internal fields
- [ ] Security-relevant events are logged/redacted

---

## 4. Endpoint Hardening Checklist

For every new/changed endpoint:

| Area           | Question                                                              |
| -------------- | --------------------------------------------------------------------- |
| Route exposure | Is this endpoint public, authenticated, or admin-only?                |
| Authentication | Is caller identity verified where required?                           |
| Authorization  | Can this user act on this specific resource?                          |
| Validation     | Are body, query, and params validated?                                |
| Abuse control  | Does this endpoint need rate limits, caps, or timeouts?               |
| Output safety  | Are sensitive fields excluded from responses?                         |
| Logging        | Are important deny/failure events observable without leaking secrets? |

---

## 5. Authentication and Session Baseline

- Passwords are hashed with strong algorithms (e.g., bcrypt/argon2) and safe cost settings
- Login/register/reset endpoints have rate limiting
- Auth errors are generic (do not reveal account existence or internals)
- Tokens/sessions are handled securely (expiry, rotation/revocation where applicable)
- JWTs are verified (`verify`) with expected claims; never trusted from decode-only flows
- Logout/revocation strategy exists for persistent auth mechanisms

---

## 6. Authorization Baseline

- Authentication (AuthN) is not authorization (AuthZ)
- Enforce ownership checks for user-owned resources
- Enforce tenant/org scoping in multi-tenant systems
- Admin routes require explicit policy checks
- Avoid ID-only lookups for user-owned data

Example:

```js
// Bad
const order = await Order.findById(req.params.id);

// Good
const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
```

---

## 7. Input Validation and Output Safety

- Validate `body`, `query`, and `params` at route boundary
- Reject unknown fields on sensitive write endpoints
- Prevent mass assignment (allow-list writable fields)
- Avoid raw regex/query construction from untrusted input
- Avoid unsafe HTML rendering (XSS-prone sinks)
- Keep validation error shape stable, concise, and non-sensitive

---

## 8. High-Risk Features

### File uploads

- Restrict MIME/type and size
- Use server-generated file names/paths
- Require auth for non-public upload flows

### Payments

- Recompute totals server-side
- Require idempotency for money-moving operations
- Confirm provider result before state/fulfillment changes

### Password reset / email links

- Use random, short-lived, single-use tokens
- Rate-limit issuance and verification endpoints
- Never log raw reset/verification tokens

### Webhooks

- Verify provider signatures
- Enforce replay protection (event-id dedupe)
- Make handlers idempotent and retry-safe

### Outbound URL fetches (SSRF risk)

- Allow-list domains/protocols
- Block localhost/private network targets
- Enforce strict timeout/size limits

---

## 9. Secrets, Config, and Logs

- No secrets in source code or client bundles
- Required env vars validated at startup (fail fast)
- Separate and explicit dev/stage/prod configuration
- Production responses must not expose stack traces/internal paths/token material
- Sensitive log fields are redacted (e.g., password, token, authorization, secret)

---

## 10. Abuse and Availability

- Apply stricter rate limits on auth-sensitive endpoints
- Enforce pagination caps and sane defaults
- Enforce request body size limits
- Set DB/upstream/request timeouts
- Review expensive operations (queries, exports, uploads, bulk actions)
- Add bot/scrape detection signals where relevant (velocity, failure ratio, path patterns)

---

## 11. Shipping Checklist

Before deployment:

- [ ] Tests pass
- [ ] Security-sensitive routes reviewed
- [ ] Dependency scan results reviewed
- [ ] Required env vars configured correctly
- [ ] Production errors do not leak internals
- [ ] Logs redact sensitive data
- [ ] Rollback path exists for risky changes

---

## 12. Security-Sensitive Change Examples

Require extra review for changes involving:

- Auth/session/token logic
- Authorization policy or ownership logic
- Payment or webhook behavior
- File upload or download handling
- New admin/protected routes
- CORS/security-header policy
- Logging/error handling behavior
- Dependency upgrades with security impact
