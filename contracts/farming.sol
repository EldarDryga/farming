// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract test_farming {
    using SafeERC20 for IERC20;
    using SafeCast for uint256;

    struct UserInfo {
        bool deposited;
        uint64 percentage;
        uint64 startTime;
        uint depositedAmount;
    }
    mapping(address => UserInfo) public infoOfUser;

    IERC20 internal immutable _tokenA;
    IERC20 internal immutable _tokenB;
    address owner;
    uint public poolA;
    uint public poolB;
    uint public amountPerSecond;

    constructor(address token_A, address token_B) {
        owner = msg.sender;
        poolA = 0;
        poolB = 0;

        require(token_A != address(0), "Address of token = 0");
        _tokenA = IERC20(token_A);
        require(token_B != address(0), "Address of token = 0");
        _tokenB = IERC20(token_B);
    }

    function deposit_tokenA(uint _amount, uint _amountPerSecond) external {
        require(msg.sender == owner, "You are not an owner");
        _tokenA.safeTransferFrom(msg.sender, address(this), _amount);
        amountPerSecond = _amountPerSecond;
        poolA = poolA + _amount;
    }

    function deposit_tokenB(uint _amount) external {
        require(
            infoOfUser[msg.sender].deposited == false,
            "You already deposited tokens, use withdrawAll to claim your revard"
        );

        _tokenB.safeTransferFrom(msg.sender, address(this), _amount);
        infoOfUser[msg.sender].startTime = (block.timestamp).toUint64();
        poolB = poolB + _amount;
        infoOfUser[msg.sender].percentage = ((_amount * 1000000) / poolB)
            .toUint64(); // multiplication by 10000 to avoid fractional number
        infoOfUser[msg.sender].depositedAmount = _amount;
        infoOfUser[msg.sender].deposited = true;
    }

    function withdrawAll() external {
        require(
            infoOfUser[msg.sender].startTime != 0,
            "You did not deposit any tokens"
        );
        uint amountToDistribute = ((infoOfUser[msg.sender].percentage *
            (amountPerSecond *
                ((block.timestamp).toUint64() -
                    infoOfUser[msg.sender].startTime))) / 1000000) *
            amountPerSecond;
        if (amountToDistribute >= poolA) {
            _tokenA.safeTransfer(msg.sender, poolA);
        } else {
            _tokenA.safeTransfer(msg.sender, amountToDistribute);
        }
        _tokenB.safeTransfer(
            msg.sender,
            infoOfUser[msg.sender].depositedAmount
        );
        infoOfUser[msg.sender].deposited = false;
        poolB = poolB - infoOfUser[msg.sender].depositedAmount;
        poolA = poolA - amountToDistribute;
    }
    function withdrawAllForOwner () external{
        require(msg.sender == owner, "You are not an owner");
         _tokenA.safeTransfer(msg.sender, poolA);
    }
}
