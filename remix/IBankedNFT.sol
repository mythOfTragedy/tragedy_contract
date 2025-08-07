// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBankedNFT {
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, address indexed creator, string metadataURI);
    event SoulBoundNFTMinted(address indexed to, uint256 indexed tokenId, address indexed creator, string metadataURI);
    event NFTBurned(uint256 indexed tokenId);
    event Withdrawn(address indexed owner, uint256 amount);
    event ReceivedEther(address indexed from, uint256 amount);
    event ConfigUpdated(string name, string symbol, uint256 mintFee, uint256 royaltyRate);

    // Read functions
    function owner() external view returns (address);
    function maxSupply() external view returns (uint256);
    function totalMinted() external view returns (uint256);
    function mintFee() external view returns (uint256);
    function royaltyRate() external view returns (uint256);
    function metadataBank() external view returns (address);
    function isSoulBound(uint256 tokenId) external view returns (bool);
    function canMint() external view returns (bool);
    function remainingSupply() external view returns (uint256);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
    function tokenByIndex(uint256 index) external view returns (uint256);

    // Write functions
    function mint() external payable returns (uint256);
    function mintSoulBound() external payable returns (uint256);
    function airdrop(address to) external returns (uint256);
    function burn(uint256 tokenId) external;
    function config(string memory newName, string memory newSymbol, uint256 newMintFee, uint256 newRoyaltyRate) external;
    function setMetadataBank(address bankAddress) external;
    function withdraw() external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}