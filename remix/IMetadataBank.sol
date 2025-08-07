// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMetadataBank {
    // Core functions that must be implemented
    function getMetadata(uint256 index) external view returns (string memory);
    function getMetadataCount() external view returns (uint256);
}