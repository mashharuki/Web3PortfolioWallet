//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

interface IDNS {
    // Verifiable Credentials
    struct VcInfo {
        string name;
        string cid;
    }

    function register(
        string calldata name,
        string calldata did,
        address to
    ) external;

    function getDidInfo(
        string calldata name
    ) external view returns (string memory);

    function getAllNames() external view returns (string[] memory);

    function getVcs(string memory _did) external view returns (VcInfo[] memory);

    function valid(string calldata name) external pure returns (bool);

    function updateVc(
        string memory _did,
        string memory _name,
        string memory _cid
    ) external;
}
