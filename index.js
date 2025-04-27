const { ethers } = require("ethers");

// EIP-712 Type Definitions
const domain = {
  name: "TdsContract",
  version: "1.0.0",
  chainId: 1, // Matching the test environment chain ID
  verifyingContract: "0x1Bcd6c83f3b2D2FC242a9223FFA0cbe43b272E35", // Contract address from test
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

    const signature = await wallet._signTypedData(
      domain,
      userOrderTypes,
      userOrder
    );
    console.log("\nSignature:", signature);

    const expectedSignature =
      "0xd9c723195d1ca33c804ecc340ec1825b8d8e70414635b241bde94490408b2cf00ce07b7f2a1976161384882e0eb7e7a55b670c603eec9c001a2b8687ed9355971c";
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

    const signature = await wallet._signTypedData(domain, orderTypes, order);
    console.log("\nSignature:", signature);

    const expectedSignature =
      "0xcc9a7273f33fee7df107eefcd1ee02cc602f3ab5cd94865a18fed6ad01a9af9125620f9cc95aab96b247cb4d07c22167767f7dd1498619c18efbdb50a7c16e1b1b";
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
