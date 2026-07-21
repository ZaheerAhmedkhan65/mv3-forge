# Security Policy

## Reporting a Vulnerability

We take the security of mv3-forge seriously. If you discover a security vulnerability, please report it responsibly by following these steps:

1. **Do not** open a public issue for the vulnerability
2. Email the maintainer directly at the addresses provided in the GitHub profile, or
3. Use GitHub's security advisory feature: [Security > Advisories > Report a vulnerability](https://github.com/ZaheerAhmedkhan65/mv3-forge/security/advisories/new)

Please include the following information in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

## Security Measures

This project uses the following security features:

| Feature | Status | Description |
|---------|--------|-------------|
| Dependabot | ✅ Enabled | Automated dependency updates with security patches |
| Secret Scanning | ✅ Enabled | Detects accidentally committed secrets |
| Code Scanning (CodeQL) | ✅ Enabled | Automated code analysis for vulnerabilities |
| Dependency Graph | ✅ Enabled | Visualizes project dependencies |
| Automatic Security Updates | ✅ Enabled | Automatically updates vulnerable dependencies |

## Supported Versions

| Version | Supported | Security Updates |
|---------|-----------|----------------|
| 0.1.x   | ✅ Yes    | Critical fixes only |
| < 0.1.0 | ❌ No     | No longer supported |

## Security Best Practices

When developing for mv3-forge, please follow these security best practices:

- **Dependency Management**: Keep dependencies updated and review security advisories
- **Code Review**: All changes require review before merging
- **Secrets Management**: Never commit API keys, tokens, or credentials
- **Input Validation**: Validate all user inputs in the CLI
- **Template Security**: Ensure templates don't include malicious code

## Response Timeline

- **Initial Response**: Within 48 hours
- **Triage**: Within 1 week
- **Fix**: Dependent on severity (critical issues prioritized)
- **Disclosure**: Coordinated with reporter after fix is available

Thank you for helping keep mv3-forge secure!