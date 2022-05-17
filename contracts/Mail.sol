// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Mail is Ownable {
    bool contractIsActive = true;
    address _relayer;

    event AccountCreated(address accountAddress, string dataCID);
    event mailSent(address from, address to, string dataCID);
    event relayerChanged(address relayer);

    constructor(address relayer) {
        _relayer = relayer;
    }

    function setRelayer(address relayer) public onlyOwner() {
        _relayer = relayer;
        emit relayerChanged(_relayer);
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

    function sendMail(address from, address to, string calldata dataCID)
    public 
    onlyRelayer()
    {
        emit mailSent(from, to, dataCID);
    }

    function deprecateContract()
    public
    onlyOwner()
    isActive()
    {
        contractIsActive = false;
    }

    modifier isActive() {
        require(contractIsActive == true, "Contract has been deprecated");
        _;
    }

    modifier onlyRelayer() {
        require(_relayer == _msgSender(), "Message should come from relayer only");
        _;
    }
}