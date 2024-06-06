// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MintableToken is ERC20, Ownable {

    // Address of the server that provides valid signatures
    address public serverAddress;

    // Mapping to keep track of used nonces
    mapping(bytes32 => bool) public usedNonces;

    // Custom decimals
    uint8 private _decimals;

    // Chain ID
    uint256 private _chainId;

    constructor(string memory name, string memory symbol, uint256 chainId) ERC20(name, symbol) Ownable(msg.sender) {
        serverAddress = msg.sender;
        _decimals = 0;
        _chainId = chainId;
    }

    function decimals() override public view virtual returns (uint8) {
        return _decimals;
    }

    function setServerAddress(address _serverAddress) external onlyOwner {
        serverAddress = _serverAddress;
    }

    function setChainId(uint256 chainId) external onlyOwner {
        _chainId = chainId;
    }

    function mint(bytes32 nonce, bytes calldata signature) external {
        // The amount to be minted is always 1
        uint256 amount = 1;

        // Recreate the message that was signed
        bytes32 message = keccak256(abi.encodePacked(msg.sender, amount, nonce, _chainId));
        
        // Ensure the nonce has not been used
        require(!usedNonces[nonce], "Nonce already used");

        // Verify the signature
        require(_verifySignature(message, signature), "Invalid signature");

        // Mark the nonce as used
        usedNonces[nonce] = true;

        // Mint the tokens
        _mint(msg.sender, amount);
    }

    using ECDSA for bytes32;

    function _verifySignature(bytes32 message, bytes memory signature) internal view returns (bool) {
        return ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(message), signature) == serverAddress;
    }
}

