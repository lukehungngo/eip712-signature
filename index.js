const { ethers } = require("ethers");

// EIP-712 Type Definitions
const domain = {
  name: "TdsContract",
  version: "1.0.0",
  chainId: 1, // Matching the test environment chain ID
  verifyingContract: "0x5B0091f49210e7B2A57B03dfE1AB9D08289d9294", // Contract address from test
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
      "0xf33b6f16a10b3c6256a690e0d95b3f2f88f967ab2473dfac778f58508fab825229e64515f3fc9471ff68afee4320e656f6b34f9e36ae506cc0bf908b48ebadca1c";
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
      "0x45f8a011bce2f4d3a01c12d0be5e34b8e8bf6391f25bb57b86b7dc7c992c74a3147599b7f0d82b9a44db6b9a9d4951c398779424394201979257694a01fa9d161c";
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
