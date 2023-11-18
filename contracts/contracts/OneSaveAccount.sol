// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

import "./core/BaseAccount.sol";
import "./callback/TokenCallbackHandler.sol";

/**
 *  has execute, eth handling methods
 *  has a single signer that can send requests through the entryPoint.
 */
contract OneSaveAccount is
    BaseAccount,
    TokenCallbackHandler,
    UUPSUpgradeable,
    Initializable
{
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    address public owner;
    address public approvedAddress;
    uint256 public lastActivityTime;

    IEntryPoint private immutable _entryPoint;

    event SimpleAccountInitialized(
        IEntryPoint indexed entryPoint,
        address indexed owner
    );

    event ERC20Approved(
        address indexed account,
        address indexed spender,
        uint256 timestamp
    );

    event ERC20IncreaseAllowance(
        address indexed account,
        address indexed spender,
        uint256 timestamp
    );

    event ERC20DecreaseAllowance(
        address indexed account,
        address indexed spender,
        uint256 timestamp
    );

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(
            msg.sender == owner || msg.sender == address(this),
            "only owner"
        );
    }

    function updateActivity() internal {
        lastActivityTime = block.timestamp;
    }

    function setApprovedAddress(address _approvedAddress, IERC721Enumerable nftContract) public {
    _requireFromEntryPointOrOwner();
    approvedAddress = _approvedAddress;
    uint256 balance = nftContract.balanceOf(address(this));
    for (uint256 i = 0; i < balance; i++) {
        uint256 tokenId = nftContract.tokenOfOwnerByIndex(address(this), i);
        nftContract.approve(approvedAddress, tokenId);
    }
}

    function _onlyApprovedAddress() internal view {
        require(
            msg.sender == approvedAddress,
            "only approved address can call this function"
        );
    }

    function transferNFTsIfInactive(IERC721Enumerable nftContract, address to) public {
        _onlyApprovedAddress();
        require(
            block.timestamp > lastActivityTime + 30 seconds,
            "Account is still active"
        );
        uint256 balance = nftContract.balanceOf(address(this));
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = nftContract.tokenOfOwnerByIndex(address(this), i);
            nftContract.transferFrom(address(this), to, tokenId);
        }
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
        updateActivity();
    }

    /**
     * execute a sequence of transactions
     * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
     */
    function executeBatch(
        address[] calldata dest,
        uint256[] calldata value,
        bytes[] calldata func
    ) external {
        _requireFromEntryPointOrOwner();
        require(
            dest.length == func.length &&
                (value.length == 0 || value.length == func.length),
            "wrong array lengths"
        );
        if (value.length == 0) {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], 0, func[i]);
            }
        } else {
            for (uint256 i = 0; i < dest.length; i++) {
                _call(dest[i], value[i], func[i]);
            }
        }
        updateActivity();
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
     * the implementation by calling `upgradeTo()`
     */
    function initialize(address anOwner) public virtual initializer {
        _initialize(anOwner);
    }

    function _initialize(address anOwner) internal virtual {
        owner = anOwner;
        updateActivity();
        emit SimpleAccountInitialized(_entryPoint, owner);
    }

    // Require the function call went through EntryPoint or owner
    function _requireFromEntryPointOrOwner() internal view {
        require(
            msg.sender == address(entryPoint()) ||
                msg.sender == owner ||
                msg.sender == address(this),
            "account: not Owner or EntryPoint"
        );
    }

    /// implement template method of BaseAccount
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (owner != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        return 0;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value: msg.value}(address(this));
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(
        address payable withdrawAddress,
        uint256 amount
    ) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    /**
     * approve an ERC20 for this account
     * @param spender address of the spender
     */
    function approveERC20(
        address _token,
        address spender,
        uint256 amount
    ) external {
        _requireFromEntryPointOrOwner();
        IERC20(_token).safeApprove(spender, amount);
        updateActivity();
        emit ERC20Approved(address(this), spender, block.timestamp);
    }

    /**
     * increase allowance of an ERC20 for this account
     * @param spender address of the spender
     */
    function increaseAllowanceERC20(
        address _token,
        address spender,
        uint256 amount
    ) external {
        _requireFromEntryPointOrOwner();
        IERC20(_token).safeIncreaseAllowance(spender, amount);
        updateActivity();
        emit ERC20IncreaseAllowance(address(this), spender, block.timestamp);
    }

    /**
     * decrease allowance of an ERC20 for this account
     * @param spender address of the spender
     */
    function decreaseAllowanceERC20(
        address _token,
        address spender,
        uint256 amount
    ) external {
        _requireFromEntryPointOrOwner();
        IERC20(_token).safeDecreaseAllowance(spender, amount);
        updateActivity();
        emit ERC20DecreaseAllowance(address(this), spender, block.timestamp);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal view override {
        (newImplementation);
        _onlyOwner();
    }
}
