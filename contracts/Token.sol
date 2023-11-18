// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Token {
    uint8 private constant DECIMALS = 18;

    string private _name;
    string private _symbol;
    uint256 private _totalSupply;
    address private immutable owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory __name,
        string memory __symbol,
        uint256 __totalSupply
    ) {
        _name = __name;
        _symbol = __symbol;
        _totalSupply = __totalSupply * (10 ** DECIMALS);
        balanceOf[msg.sender] = _totalSupply;

        owner = msg.sender;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        _transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        require(_spender != address(0), "Invalid Spender.");
        require(msg.sender == owner, "Approver is not owner.");

        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        _transfer(_from, _to, _value);

        allowance[_from][msg.sender] -= _value;

        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0));

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    // Getter Functions

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function decimals() external pure returns (uint8) {
        return DECIMALS;
    }
}
