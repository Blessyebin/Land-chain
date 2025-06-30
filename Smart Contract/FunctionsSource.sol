// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title FunctionsSource
/// @notice Holds JavaScript source for Chainlink Functions
abstract contract FunctionsSource {
    string public getNftMetadata =
        "const ipfsCid = args[0];"
        "const tokenId = args[1];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "    url: `https://orange-occasional-aardwolf-722.mypinata.cloud/ipfs/${ipfsCid}`,"
        "});"
        "if (!apiResponse || apiResponse.error) { throw Error('Failed to fetch metadata'); }"
        "const metadata = apiResponse.data;"
        "return Functions.encodeString(`ipfs://${ipfsCid}`);";
}
