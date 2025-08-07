// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IComposerV5 {
    function owner() external view returns (address);
    function monsterBank() external view returns (address);
    function backgroundBank() external view returns (address);
    function itemBank() external view returns (address);
    function effectBank() external view returns (address);
    
    function getSVG(uint8 species, uint8 background, uint8 item, uint8 effect) external view returns (string memory);
    function getTransformedItem(uint8 species, uint8 item) external pure returns (uint8);
    function filterParams(uint8 background) external view returns (uint16, uint16, uint16);
    
    function setBanks(
        address _monsterBank,
        address _backgroundBank,
        address _itemBank,
        address _effectBank
    ) external;
}