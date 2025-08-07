#!/bin/bash

# Deploy Script for Tragedy NFT
# This script automates the deployment process and updates viewer/deployment.json

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default network
NETWORK=${1:-bonsoleil}

echo -e "${YELLOW}=====================================${NC}"
echo -e "${YELLOW}Tragedy NFT Deployment Script${NC}"
echo -e "${YELLOW}=====================================${NC}"
echo -e "Network: ${GREEN}$NETWORK${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Clean previous deployments
echo -e "${YELLOW}Step 1: Cleaning previous deployments...${NC}"
rm -f deployment-*.json
rm -f sample-*.svg
rm -rf artifacts cache deployments

# Compile contracts
echo -e "${YELLOW}Step 2: Compiling contracts...${NC}"
npx hardhat compile

# Deploy base contracts
echo -e "${YELLOW}Step 3: Deploying base contracts...${NC}"
npx hardhat run scripts/01-deploy-all.js --network $NETWORK

if [ $? -ne 0 ]; then
    echo -e "${RED}Base contract deployment failed${NC}"
    exit 1
fi

# Test material layer
echo -e "${YELLOW}Step 4: Testing material layer...${NC}"
npx hardhat run scripts/test-material-layer.js --network $NETWORK

if [ $? -ne 0 ]; then
    echo -e "${RED}Material layer test failed${NC}"
    exit 1
fi

# Test effect layer
echo -e "${YELLOW}Step 5: Testing effect layer...${NC}"
npx hardhat run scripts/test-effect-layer.js --network $NETWORK

if [ $? -ne 0 ]; then
    echo -e "${RED}Effect layer test failed${NC}"
    exit 1
fi

# Deploy NFT contract (optional)
if [ "$2" == "--with-nft" ]; then
    echo -e "${YELLOW}Step 6: Deploying NFT contract...${NC}"
    npx hardhat run scripts/04-deploy-nft.js --network $NETWORK
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}NFT deployment failed${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "viewer/deployment.json has been automatically updated"
echo -e "You can now open viewer/material-explorer.html to test"
echo ""

# Show deployment info
if [ -f "viewer/deployment.json" ]; then
    echo -e "${YELLOW}Deployed contracts:${NC}"
    cat viewer/deployment.json | grep -E '"(composer|monsterBank|itemBank|backgroundBank|effectBank)"' | sed 's/[",]//g' | sed 's/^/  /'
fi