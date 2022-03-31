//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.13;

contract Whitelist {

    uint8 public maxWhitelistedAddresses;
    mapping(address => bool) public whitelistedAddresses;
    uint8 public numOfAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        if (whitelistedAddresses[msg.sender]) {
            revert("Sender has already been whitelisted");
        }

        if (numOfAddressesWhitelisted >= maxWhitelistedAddresses) {
            revert("More addresses cant be added, limit reached");
        }

        whitelistedAddresses[msg.sender] = true;
        numOfAddressesWhitelisted += 1;
    }
}