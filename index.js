const { ethers } = require("ethers");

// EIP-712 Type Definitions
const domain = {
  name: "TdsContract",
  version: "1.0.0",
  chainId: 421614, // Matching the test environment chain ID
  verifyingContract: "0xea510eEd83C4F08a69Bb425728B3523783693e7F", // Contract address from test
};

const userOrderTypes = {
  UserOrder: [
    { name: "userID", type: "address" },
    { name: "pair", type: "string" },
    { name: "price", type: "uint256" },
    { name: "quantity", type: "uint256" },
    { name: "side", type: "uint8" },
    { name: "orderType", type: "uint8" },
  ],
};

const orderTypes = {
  Order: [
    { name: "userID", type: "address" },
    { name: "pair", type: "string" },
    { name: "price", type: "uint256" },
    { name: "quantity", type: "uint256" },
    { name: "side", type: "uint8" },
    { name: "orderType", type: "uint8" },
    { name: "orderId", type: "string" },
  ],
};

async function signUserOrder() {
  const PRIVATE_KEY =
    "0x9c0257114eb9399a2985f8e75dad7600c5d89fe3824ffa99ec1c3eb8bf3b0501";

  const wallet = new ethers.Wallet(PRIVATE_KEY);

  const userOrder = {
    userID: "0x328809Bc894f92807417D2dAD6b7C998c1aFdac6",
    pair: "BTC/USD",
    price: 10000,
    quantity: ethers.utils.parseEther("1"),
    side: 0,
    orderType: 1,
  };

  try {
    console.log("Domain:", domain);
    console.log("Types:", userOrderTypes);
    console.log("UserOrder:", userOrder);

    // Calculate EIP-712 domain separator
    const domainSeparatorJS = ethers.utils._TypedDataEncoder.hashDomain(domain);
    console.log("\nJS Domain Separator:", domainSeparatorJS);
    const internalDomainHash =
      ethers.utils._TypedDataEncoder.hashDomain(domain);
    console.log("Internal Domain Hash:", internalDomainHash);
    if (internalDomainHash !== domainSeparatorJS) {
      throw new Error("InternalDomain hash mismatch");
    }
    const expectedDomainHash =
      "0xe09f678c0990499685aa1fd3071947345fbe5f526e3f1e404415568ec4c0fef4";
    console.log(
      "Domain Hash Matches:",
      domainSeparatorJS === expectedDomainHash
    );

    // Calculate EIP-712 struct hash for UserOrder
    const structHashJS = ethers.utils._TypedDataEncoder.hashStruct(
      "UserOrder",
      userOrderTypes,
      userOrder
    );
    const internalStructHash = ethers.utils._TypedDataEncoder
      .from(userOrderTypes)
      .hash(userOrder);
    console.log("Internal Struct Hash:", internalStructHash);
    if (internalStructHash !== structHashJS) {
      throw new Error("InternalStruct hash mismatch");
    }

    const expectedStructHashJS =
      "0x82e6f72dc84952903e1cadf5c7075cb11bacd4a6b9d6a39a2b5561195f989887";
    console.log("JS Struct Hash:", structHashJS);
    console.log(
      "JS Struct Hash Matches:",
      structHashJS === expectedStructHashJS
    );

    const expectedUserOrderHash =
      "0xe8914527c3253c4446999aad0dfd2bee90f94da648bbaad27e8ee5f7945353be";
    const userOrderHash = ethers.utils._TypedDataEncoder.hash(
      domain,
      userOrderTypes,
      userOrder
    );
    console.log("UserOrder Hash:", userOrderHash);
    console.log("Expected UserOrder Hash:", expectedUserOrderHash);
    console.log(
      "UserOrder Hash Matches:",
      userOrderHash === expectedUserOrderHash
    );

    const signature = await wallet._signTypedData(
      domain,
      userOrderTypes,
      userOrder
    );
    console.log("\nSignature:", signature);

    const expectedSignature =
      "0x11a7a0cd689334a0d6ef9039579a78ae57e71e32f90c28e1e8fbfc6d6f49c46963017ab1f06ac8f087a615e03df161683768d5da286fd3a836e51ec00fbee2a41b";
    console.log("Expected Signature:", expectedSignature);
    console.log("Signatures match:", signature === expectedSignature);

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      userOrderTypes,
      userOrder,
      signature
    );
    console.log("\nRecovered address:", recoveredAddress);
    console.log("Expected address:", userOrder.userID);
    console.log(
      "Address match:",
      recoveredAddress.toLowerCase() === userOrder.userID.toLowerCase()
    );
    return signature;
  } catch (error) {
    console.error("Error signing order:", error);
  }
}

async function signOrder() {
  const PRIVATE_KEY =
    "0xf53be943994b63da1849cc444d234f1601cafbfb35ecdcad512c0e465b652c90";

  const wallet = new ethers.Wallet(PRIVATE_KEY);

  const order = {
    userID: "0x328809Bc894f92807417D2dAD6b7C998c1aFdac6",
    pair: "BTC/USD",
    price: 10000,
    quantity: ethers.utils.parseEther("1"),
    side: 0,
    orderType: 1,
    orderId: "1",
  };

  try {
    console.log("Domain:", domain);
    console.log("Types:", orderTypes);
    console.log("Order:", order);

    const domainSeparatorJS = ethers.utils._TypedDataEncoder.hashDomain(domain);
    console.log("\nJS Domain Separator:", domainSeparatorJS);
    const internalDomainHash =
      ethers.utils._TypedDataEncoder.hashDomain(domain);
    console.log("Internal Domain Hash:", internalDomainHash);
    if (internalDomainHash !== domainSeparatorJS) {
      throw new Error("InternalDomain hash mismatch");
    }
    const expectedDomainHash =
      "0xe09f678c0990499685aa1fd3071947345fbe5f526e3f1e404415568ec4c0fef4";
    console.log(
      "Domain Hash Matches:",
      domainSeparatorJS === expectedDomainHash
    );

    const structHashJS = ethers.utils._TypedDataEncoder.hashStruct(
      "Order",
      orderTypes,
      order
    );
    console.log("JS Struct Hash:", structHashJS);
    const internalStructHash = ethers.utils._TypedDataEncoder
      .from(orderTypes)
      .hash(order);
    console.log("Internal Struct Hash:", internalStructHash);
    if (internalStructHash !== structHashJS) {
      throw new Error("InternalStruct hash mismatch");
    }
    if (internalStructHash !== structHashJS) {
      throw new Error("InternalStruct hash mismatch");
    }
    const expectedStructHashJS =
      "0x86b265fe4e42471ce4d5a2611b6878626ea4236491a498b79ea8761f5efddfe2";
    console.log("JS Struct Hash:", structHashJS);
    console.log(
      "JS Struct Hash Matches:",
      structHashJS === expectedStructHashJS
    );

    const expectedOrderHash =
      "0x7fb7f11b742eea78541fa27a03cdf6137403e7ed79c4174e5a1008949801ea39";
    const orderHash = ethers.utils._TypedDataEncoder.hash(
      domain,
      orderTypes,
      order
    );
    console.log("Order Hash:", orderHash);
    console.log("Expected Order Hash:", expectedOrderHash);
    console.log("Order Hash Matches:", orderHash === expectedOrderHash);

    const signature = await wallet._signTypedData(domain, orderTypes, order);
    console.log("\nSignature:", signature);

    const expectedSignature =
      "0x10e509ab476004ad607532c2e8629de1153803e06afbba9451d3a09b3ec6e72330ade8f90c51161a6e4b844ed06557318b58ce9d32441a61a06e8a44c7abce301b";
    console.log("Expected Signature:", expectedSignature);
    console.log("Signatures match:", signature === expectedSignature);

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      orderTypes,
      order,
      signature
    );
    console.log("\nRecovered address:", recoveredAddress);
    console.log("Expected address:", wallet.address);
    console.log(
      "Address match:",
      recoveredAddress.toLowerCase() === wallet.address.toLowerCase()
    );
    return signature;
  } catch (error) {
    console.error("Error signing order:", error);
  }
}

async function main() {
  console.log("Signing user order...");
  await signUserOrder();
  console.log("--------------------------------");
  console.log("Signing order...");
  await signOrder();
}

main().catch(console.error);
