#!/bin/bash

# =============================================================================
# Tragedy NFT - Unified Deployment Shell Script
# =============================================================================
# This script provides a flexible deployment interface that respects .env settings
# and supports multiple deployment targets.
#
# Usage:
#   ./scripts/deploy/deploy.sh [network] [options]
#
# Examples:
#   ./scripts/deploy/deploy.sh                    # Deploy to default network from .env
#   ./scripts/deploy/deploy.sh bonsoleil          # Deploy to specific network
#   ./scripts/deploy/deploy.sh --verify           # Deploy and verify
#   ./scripts/deploy/deploy.sh bonsoleil --verify # Deploy to bonsoleil and verify
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo -e "\n${BOLD}$1${NC}"
    echo "============================================================"
}

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    print_success "Loaded .env file"
else
    print_warning ".env file not found"
fi

# Determine network
NETWORK=""
VERIFY=false
SKIP_COMPILE=false
ONLY=""
FROM=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --verify)
            VERIFY=true
            shift
            ;;
        --skip-compile)
            SKIP_COMPILE=true
            shift
            ;;
        --only)
            ONLY="$2"
            shift 2
            ;;
        --from)
            FROM="$2"
            shift 2
            ;;
        --help|-h)
            print_header "Tragedy NFT Deployment Script"
            echo "Usage: $0 [network] [options]"
            echo ""
            echo "Networks:"
            echo "  sepolia      - Ethereum Sepolia testnet"
            echo "  private      - Private chain (configured via .env)"
            echo "  ethereum     - Ethereum mainnet"
            echo "  polygon      - Polygon mainnet"
            echo "  base         - Base mainnet"
            echo "  hardhat      - Local Hardhat network"
            echo ""
            echo "Options:"
            echo "  --verify     - Run verification after deployment"
            echo "  --skip-compile - Skip compilation step"
            echo "  --only <contract> - Deploy only specific contract"
            echo "  --from <contract> - Deploy from specific contract onwards"
            echo "  --help, -h   - Show this help message"
            echo ""
            echo "Environment:"
            echo "  RPC_URL      - Custom RPC URL (from .env)"
            echo "  PRIVATE_KEY  - Deployment wallet private key (from .env)"
            echo ""
            echo "Examples:"
            echo "  $0                    # Deploy to default network"
            echo "  $0 private          # Deploy to private network"
            echo "  $0 private --verify # Deploy and verify"
            echo "  $0 --only bankedNFT  # Deploy only NFT contract"
            echo "  $0 --from composer   # Deploy from composer onwards"
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            exit 1
            ;;
        *)
            if [ -z "$NETWORK" ]; then
                NETWORK="$1"
            fi
            shift
            ;;
    esac
done

# If no network specified, try to detect from .env or use default
if [ -z "$NETWORK" ]; then
    if [ ! -z "$RPC_URL" ]; then
        if [[ "$RPC_URL" == *"sepolia"* ]]; then
            NETWORK="sepolia"
            print_info "Detected Sepolia testnet from RPC_URL"
        elif [[ "$RPC_URL" == *"polygon"* ]]; then
            NETWORK="polygon"
            print_info "Detected Polygon network from RPC_URL"
        elif [[ "$RPC_URL" == *"base"* ]]; then
            NETWORK="base"
            print_info "Detected Base network from RPC_URL"
        else
            NETWORK="private"
            print_info "Using private network configuration from .env"
        fi
    else
        NETWORK="private"
        print_info "Using default network: private"
    fi
fi

# No network aliases needed anymore

print_header "Tragedy NFT Deployment"
print_info "Network: ${BOLD}$NETWORK${NC}"
print_info "RPC URL: ${RPC_URL:-default}"
print_info "Verify: $VERIFY"
print_info "Skip Compile: $SKIP_COMPILE"
if [ -n "$ONLY" ]; then
    print_info "Deploy Mode: Single contract ($ONLY)"
elif [ -n "$FROM" ]; then
    print_info "Deploy Mode: From $FROM onwards"
fi

# Check prerequisites
print_header "Checking Prerequisites"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm is installed"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found, running npm install..."
    npm install
fi
print_success "Dependencies are installed"

# Check private key
if [ -z "$PRIVATE_KEY" ]; then
    print_error "PRIVATE_KEY not set in .env"
    exit 1
fi
print_success "Private key is configured"

# Compile contracts
if [ "$SKIP_COMPILE" = false ]; then
    print_header "Compiling Contracts"
    npx hardhat compile
    print_success "Compilation complete"
else
    print_info "Skipping compilation"
fi

# Deploy contracts
print_header "Deploying Contracts"
print_info "Running deployment script..."

# Build deployment command
DEPLOY_CMD="npx hardhat run scripts/deploy/main.js --network $NETWORK"

# Add optional parameters
if [ -n "$ONLY" ]; then
    DEPLOY_CMD="$DEPLOY_CMD -- --only $ONLY"
elif [ -n "$FROM" ]; then
    DEPLOY_CMD="$DEPLOY_CMD -- --from $FROM"
fi

# Execute deployment
eval $DEPLOY_CMD

DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    print_success "Deployment completed successfully!"
    
    # Run verification if requested
    if [ "$VERIFY" = true ]; then
        print_header "Running Verification"
        
        case "$NETWORK" in
            hardhat|localhost)
                print_warning "Skipping verification for local network"
                ;;
            sepolia)
                npm run verify:testnet
                ;;
            private)
                npm run verify:private
                ;;
            *)
                npx hardhat run scripts/deploy/verify.js --network "$NETWORK"
                ;;
        esac
        
        VERIFY_EXIT_CODE=$?
        if [ $VERIFY_EXIT_CODE -eq 0 ]; then
            print_success "Verification completed successfully!"
        else
            print_error "Verification failed"
            exit $VERIFY_EXIT_CODE
        fi
    fi
    
    # Show deployment summary
    print_header "Deployment Summary"
    
    # Check if current.json exists
    if [ -f "deployments/current.json" ]; then
        # Extract key addresses using node
        node -e "
        const deployment = require('./deployments/current.json');
        console.log('NFT Contract:', deployment.contracts.bankedNFT);
        console.log('Metadata:', deployment.contracts.metadata);
        console.log('Network:', deployment.network);
        console.log('Timestamp:', deployment.timestamp);
        "
    else
        print_warning "Deployment file not found"
    fi
    
    print_info ""
    print_success "Deployment complete! Check deployments/current.json for details."
    
else
    print_error "Deployment failed"
    exit $DEPLOY_EXIT_CODE
fi