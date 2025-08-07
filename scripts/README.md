# Scripts Directory Structure

## Directory Organization

### `/deploy`
Main deployment scripts and configuration
- `main.js` - Unified deployment script
- `config.js` - Deployment configuration
- `verify.js` - Post-deployment verification

### `/utils`
Utility scripts for maintenance and operations
- Contract interaction utilities
- URL updates
- Bank management

### `/test`
Test scripts for validation
- Minting tests
- Composition tests
- Integration tests

### `/archive`
Deprecated scripts kept for reference
- One-time updates
- Old generators
- Legacy deployment scripts

## Usage

```bash
# Deployment
npm run deploy:testnet
npm run deploy:production

# Verification
npm run verify

# Testing
npm run test:integration
```