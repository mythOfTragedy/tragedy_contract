// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IArweaveEffectBank {
    function getEffectUrl(uint8 effectId) external view returns (string memory);
    function getEffectName(uint8 effectId) external view returns (string memory);
    function setEffectUrl(uint8 effectId, string memory url) external;
    function setMultipleUrls(uint8[] calldata ids, string[] calldata urls) external;
    function owner() external view returns (address);
}