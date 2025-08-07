// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMetadataV5 {
    function owner() external view returns (address);
    function composer() external view returns (address);
    function getMetadataCount() external view returns (uint256);
    function getMetadata(uint256 tokenId) external view returns (string memory);
    function getSeed(uint256 tokenId) external view returns (uint256);
    function getMonster(uint256 tokenId) external view returns (uint8 species, uint8 background, uint8 item, uint8 effect);
    function setComposer(address newComposer) external;
}