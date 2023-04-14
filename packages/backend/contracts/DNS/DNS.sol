//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import {StringUtils} from "./../lib/StringUtils.sol";
import {Base64} from "./../lib/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "truffle/console.sol";
import "./../interface/IDNS.sol";

/**
 * DNS(DID Name Servivce) Contract
 */
contract DNS is ERC721URIStorage, IDNS {
    // tokenID
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Image data
    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = "</text></svg>";

    // owner address
    address payable public owner;

    // mapping
    mapping(string => string) public domains;
    mapping(string => string) public records;
    mapping(uint => string) public names;
    mapping(address => bool) public isRegistered;
    mapping(address => string) public dids;
    mapping(string => address) public addrs;
    mapping(string => VcInfo[]) public vcs;

    // event
    event Registered(address to, string did, string name);
    event UpdateVc(string did, string name, string cid);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * constuctor
     */
    constructor() payable ERC721("DID Name Service", "DNS") {
        // owner addressを設定する。
        owner = payable(msg.sender);

        console.log("owner:", owner);
    }

    /**
     * register
     * @param name domain
     * @param did did
     * @param to address
     */
    function register(
        string calldata name,
        string calldata did,
        address to
    ) public {
        // check
        require(valid(name), "invalid domain name check length");
        require(!isRegistered[to], "This address is already registered!!");

        // name
        string memory _name = string(abi.encodePacked(name));
        // create image data
        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, _name, svgPartTwo)
        );
        //　get token ID
        uint256 newRecordId = _tokenIds.current();
        uint256 length = StringUtils.strlen(name);
        string memory strLen = Strings.toString(length);

        // encode
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _name,
                '", "description": "A domain on the Ninja name service", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","length":"',
                strLen,
                '"}'
            )
        );
        // generate URI
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // register
        domains[name] = did;
        records[did] = name;
        names[newRecordId] = name;
        dids[to] = did;
        addrs[did] = to;
        isRegistered[to] = true;

        // mint NFT
        _safeMint(to, newRecordId);
        // token URO
        _setTokenURI(newRecordId, finalTokenUri);

        _tokenIds.increment();
        emit Registered(to, did, name);
    }

    /**
     * get did method
     * @param name name
     * @return did did
     */
    function getDidInfo(
        string calldata name
    ) public view returns (string memory) {
        return domains[name];
    }

    /**
     * check owner
     */
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    /**
     * gell all names
     */
    function getAllNames() public view returns (string[] memory) {
        string[] memory allNames = new string[](_tokenIds.current());
        for (uint i = 0; i < _tokenIds.current(); i++) {
            allNames[i] = names[i];
        }
        // 返却する。
        return allNames;
    }

    /**
     * check domain name
     */
    function valid(string calldata name) public pure returns (bool) {
        return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 30;
    }

    /**
     * getVcs function
     * @param _did DID
     * @return vcs[_did] Verifiable Credentials
     */
    function getVcs(string memory _did) public view returns (VcInfo[] memory) {
        return vcs[_did];
    }

    /**
     * updatVc function
     * @param _did DID
     * @param _name VC Name
     * @param _cid VC's CID
     */
    function updateVc(
        string memory _did,
        string memory _name,
        string memory _cid
    ) public {
        // get Vcinfo
        VcInfo[] storage coll = vcs[_did];

        // puch new Vc info
        coll.push(VcInfo({name: _name, cid: _cid}));
        // register again
        vcs[_did] = coll;

        emit UpdateVc(_did, _name, _cid);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = owner;
        owner = payable(newOwner);
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
