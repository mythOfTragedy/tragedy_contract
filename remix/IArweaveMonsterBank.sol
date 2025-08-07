// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IArweaveMonsterBank {
    function getMonsterSVG(uint8 monsterId) external view returns (string memory);
    function getMonsterName(uint8 monsterId) external view returns (string memory);
}