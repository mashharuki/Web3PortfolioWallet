// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * MyToken Contract
 */
contract MyToken is
    ERC20,
    ERC20Burnable,
    Pausable,
    Ownable,
    ERC20Permit,
    ERC20Votes
{
    // token
    string tokenName;
    // symbol
    string tokenSymbol;

    mapping(address => uint) public scores;

    event TokenCreated(string name, string symbol);
    event balanceChanged(address to, uint256 amount, uint balanceOf);
    event UpdateScore(address to, uint score);

    /**
     * constructor
     * @param _name token name
     * @param _symbol symbol
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        // set
        tokenName = _name;
        tokenSymbol = _symbol;

        emit TokenCreated(_name, _symbol);
    }

    /**
     * pause function
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * unpause function
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * mint function
     * @param to address
     * @param amount amount
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit balanceChanged(to, amount, balanceOf(to));
    }

    /**
     * burn
     * @param to address
     * @param amount amount
     */
    function burnToken(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
        emit balanceChanged(to, amount, balanceOf(to));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    /**
     * getScore function
     * @param addr address
     */
    function getScore(address addr) public view returns (uint) {
        return scores[addr];
    }

    /**
     * updateScore function
     * @param addr address
     * @param point point to update score
     */
    function updateScore(address addr, uint point) public onlyOwner {
        // get current score
        uint oldScore = scores[addr];
        uint newScore = oldScore + point;
        scores[addr] = newScore;

        emit UpdateScore(addr, scores[addr]);
    }
}
