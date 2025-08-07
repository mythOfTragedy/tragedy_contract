const fs = require('fs');
const path = require('path');

// Load deployment configuration
const CONFIG_PATH = path.join(__dirname, '../../deploy.config.json');
const deployConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Export configuration with helper functions
module.exports = {
    // Raw configuration
    ...deployConfig,
    
    // Helper functions
    getNetworkConfig: function(network) {
        if (!this.networks[network]) {
            throw new Error(`Unknown network: ${network}`);
        }
        return this.networks[network];
    },
    
    getNFTConfig: function() {
        return this.contracts.nft;
    },
    
    getDeploymentOrder: function() {
        return this.contracts.deploymentOrder;
    },
    
    getSeedConfig: function() {
        return this.contracts.seed;
    },
    
    getOutputPaths: function(network) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        return {
            deployment: path.join(
                __dirname, 
                '../..', 
                this.output.deploymentDir,
                `${network}-${timestamp}.json`
            ),
            viewer: path.join(__dirname, '../..', this.output.viewerConfig),
            current: path.join(
                __dirname,
                '../..',
                this.output.deploymentDir,
                'current.json'
            )
        };
    },
    
    // Validate configuration
    validate: function() {
        const required = ['networks', 'contracts', 'deployment', 'output'];
        for (const field of required) {
            if (!this[field]) {
                throw new Error(`Missing required configuration field: ${field}`);
            }
        }
        
        // Validate NFT config
        const nft = this.contracts.nft;
        if (!nft.name || !nft.symbol || !nft.maxSupply || !nft.mintFee || !nft.royaltyRate) {
            throw new Error('Invalid NFT configuration');
        }
        
        return true;
    },
    
    // Format deployment result
    formatDeployment: function(network, contracts, note = '') {
        return {
            network,
            timestamp: new Date().toISOString(),
            note: note || `Deployment via unified system`,
            contracts,
            config: {
                nft: this.contracts.nft,
                seed: this.contracts.seed
            }
        };
    }
};