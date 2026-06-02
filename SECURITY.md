# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅ Active development |

## Reporting a Vulnerability

We take the security of this financial platform seriously. If you discover a security vulnerability, please report it privately.

**Do not** disclose security issues publicly via GitHub issues, discussions, or pull requests.

### How to Report

- Email: security@finance-as-a-service.dev
- Subject: "[SECURITY] Description of the issue"

You should receive an acknowledgment within 48 hours. We will investigate all reports promptly and keep you informed of the remediation timeline.

## What to Include

- Type of vulnerability (XSS, SQL injection, privilege escalation, etc.)
- Full steps to reproduce
- Affected versions
- Any potential impact

## Scope

The following areas are in scope:
- Authentication and session management
- Authorization and role-based access controls
- API endpoint security
- Data encryption and storage
- Payment and payroll data handling

## Out of Scope

- Issues requiring physical access to a user's device
- Social engineering attacks
- Denial of service attacks
- Issues in third-party dependencies (report those to the respective maintainers)

## Security Best Practices

### For Production Deployment

1. **Environment variables**
   - Use strong, unique secrets for `AUTH_SECRET`
   - Never commit `.env` files to version control
   - Rotate secrets regularly

2. **Database**
   - Use network-isolated database instances
   - Enable encryption at rest and in transit
   - Apply least-privilege database user permissions

3. **Authentication**
   - Enforce strong password policies
   - Enable multi-factor authentication where possible
   - Implement rate limiting on login attempts

4. **Data protection**
   - Encrypt sensitive financial data at rest
   - Use HTTPS exclusively in production
   - Implement audit logging for all financial transactions

5. **Dependencies**
   - Regularly update dependencies with `pnpm audit`
   - Monitor for CVEs affecting the stack

## Disclosure Policy

We follow responsible disclosure:
1. Reporter submits vulnerability privately
2. We acknowledge receipt within 48 hours
3. We work on a fix and notify the reporter
4. Once fixed, we publish a security advisory
5. Reporter may disclose publicly after the advisory is published
