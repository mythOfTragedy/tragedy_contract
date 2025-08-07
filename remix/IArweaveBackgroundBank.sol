// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IArweaveBackgroundBank {
    function getBackgroundUrl(uint8 backgroundId) external view returns (string memory);
    function getBackgroundName(uint8 backgroundId) external view returns (string memory);
    function setBackgroundUrl(uint8 backgroundId, string memory url) external;
    function setMultipleUrls(uint8[] calldata ids, string[] calldata urls) external;
    function owner() external view returns (address);
}