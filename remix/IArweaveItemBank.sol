// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IArweaveItemBank {
    function getItemSVG(uint8 itemId) external view returns (string memory);
    function getItemName(uint8 itemId) external view returns (string memory);
}