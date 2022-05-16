// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract Mail {
    address private owner;
    bool contractIsActive = true;

    event AccountCreated(address accountAddress, string dataCID);
    event mailSent(address from, address to, string dataCID);

    constructor() {
        owner = msg.sender;
    }

    function createAccount(string calldata keyCID)
    public
    isActive()
    {
        emit AccountCreated(msg.sender, keyCID);
    }

    function sendMail(address to, string calldata dataCID)
    public
    isActive()
    {
        emit mailSent(msg.sender, to, dataCID);
    }

    function updateOwner(address newOwner)
    public
    isOwner()
    isActive()
    {
        owner = newOwner;
    }

    function deprecateContract()
    public
    isOwner()
    isActive()
    {
        contractIsActive = false;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Can only be invoked by the contract owner");
        _;
    }

    modifier isActive() {
        require(contractIsActive == true, "Contract has been deprecated");
        _;
    }
}