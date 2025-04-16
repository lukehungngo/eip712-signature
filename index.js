const { ethers } = require("ethers");

// EIP-712 Type Definitions
const domain = {
  name: "TdsContract",
  version: "1.0.0",
  chainId: 1, // Matching the test environment chain ID
  verifyingContract: "0x0BAd56221BB65860C02a2609CacA8Ea95503EC2B", // Contract address from test
};

const userOrderTypes = {
  UserOrder: [
    { name: "userID", type: "address" },
    { name: "pair", type: "string" },
    { name: "price", type: "uint256" },
    { name: "quantity", type: "uint256" },
    { name: "side", type: "uint256" },
    { name: "orderType", type: "uint256" },
  ],
};

const orderTypes = {
  Order: [
    { name: "userID", type: "address" },
    { name: "pair", type: "string" },
    { name: "price", type: "uint256" },
    { name: "quantity", type: "uint256" },
    { name: "side", type: "uint256" },
    { name: "orderType", type: "uint256" },
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
      "0xc5a4f621810c1801f31bd9f83b685547a3efcd7e1c319cc39e5f1efc8b70b7180b54bc0628f091e295a5629724c2f00bf363f447d8d0ab47dfd5e734043b94ff1c";
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
      "0x3ad11feaf810cc81548636c071cb0d15df3c8aa16bfb05d41417030a9e56e71e53dac67dc86388ba3d516a63d18d743213946420f50ad8406ea60c62e4715d021b";
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
