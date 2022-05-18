// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Relayer is Ownable {
  using ECDSA for bytes32;
  
  mapping(address => bool) public isWhitelisted;
  
  // verify the data and execute the data at the target address
  function forward(address _to, address _from, bytes calldata _data, bytes memory _signature) external returns (bytes memory _result) {
    bool success;
    
    verifySigner(_from, _data, _signature);
    
    (success, _result) = _to.call(_data);
    if (!success) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            returndatacopy(0, 0, returndatasize())
            revert(0, returndatasize())
        }
    }

    return _result;
  }

  function verifySigner(address from, bytes calldata data, bytes memory signature) private view {
      address signer = recoverSigner(keccak256(data), signature);
      require(from == signer, "From should match the signer");
      require(isWhitelisted[msg.sender], "Address sending the request is not whitelisted!");

  }
  
  // Recover signer public key and verify that it's a whitelisted signer.
  function recoverSigner(bytes32 message, bytes memory sig)
       public
       pure
       returns (address)
    {
       uint8 v;
       bytes32 r;
       bytes32 s;
       (v, r, s) = splitSignature(sig);
       return ecrecover(message, v, r, s);
  }

  function splitSignature(bytes memory sig)
       public
       pure
       returns (uint8, bytes32, bytes32)
   {
       require(sig.length == 65);
       
       bytes32 r;
       bytes32 s;
       uint8 v;
       assembly {
           // first 32 bytes, after the length prefix
           r := mload(add(sig, 32))
           // second 32 bytes
           s := mload(add(sig, 64))
           // final byte (first byte of the next 32 bytes)
           v := byte(0, mload(add(sig, 96)))
       }
       return (v, r, s);
   }
  
  function addToWhitelist(address _signer) external onlyOwner() {
      isWhitelisted[_signer] = true;
  }

  function removeFromWhitelist(address _signer) external onlyOwner() {
      isWhitelisted[_signer] = false;
  }

}