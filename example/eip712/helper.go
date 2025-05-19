package eip712

import (
	"bytes"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/math"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/signer/core/apitypes"
	"github.com/lmittmann/w3"
)

var TDSDomainType = []apitypes.Type{
	{Name: "name", Type: "string"},
	{Name: "version", Type: "string"},
	{Name: "chainId", Type: "uint256"},
	{Name: "verifyingContract", Type: "address"},
}

var UserOrder = []apitypes.Type{
	{Name: "userID", Type: "address"},
	{Name: "pair", Type: "string"},
	{Name: "price", Type: "uint256"},
	{Name: "quantity", Type: "uint256"},
	{Name: "side", Type: "uint8"},
	{Name: "orderType", Type: "uint8"},
}

var Order = []apitypes.Type{
	{Name: "userID", Type: "address"},
	{Name: "pair", Type: "string"},
	{Name: "price", Type: "uint256"},
	{Name: "quantity", Type: "uint256"},
	{Name: "side", Type: "uint8"},
	{Name: "orderType", Type: "uint8"},
	{Name: "orderId", Type: "string"},
}

var (
	TypesDomainName    = "EIP712Domain"
	TypesUserOrderName = "UserOrder"
	TypesOrderName     = "Order"
)

var signatureUserOrder = apitypes.TypedData{
	Types: apitypes.Types{
		TypesDomainName:    TDSDomainType,
		TypesUserOrderName: UserOrder,
	},
	PrimaryType: TypesUserOrderName,
	Domain:      CreateDomainSeparator(),
	Message:     createTypedDataUserOderMessage(),
}

var signatureOrder = apitypes.TypedData{
	Types: apitypes.Types{
		TypesDomainName: TDSDomainType,
		TypesOrderName:  Order,
	},
	PrimaryType: TypesOrderName,
	Domain:      CreateDomainSeparator(),
	Message:     createTypedDataOrderMessage(),
}

func CreateDomainSeparator() apitypes.TypedDataDomain {
	return apitypes.TypedDataDomain{
		Name:              "TdsContract",
		Version:           "1.0.0",
		ChainId:           math.NewHexOrDecimal256(int64(421614)),
		VerifyingContract: common.HexToAddress("0xea510eEd83C4F08a69Bb425728B3523783693e7F").Hex(),
	}
}

func createTypedDataUserOderMessage() apitypes.TypedDataMessage {
	return apitypes.TypedDataMessage{
		"userID":    "0x328809Bc894f92807417D2dAD6b7C998c1aFdac6",
		"pair":      "BTC/USD",
		"price":     w3.I("10000"),
		"quantity":  w3.I("1 ether"),
		"side":      w3.I("0"),
		"orderType": w3.I("1"),
	}
}

func createTypedDataOrderMessage() apitypes.TypedDataMessage {
	return apitypes.TypedDataMessage{
		"userID":    "0x328809Bc894f92807417D2dAD6b7C998c1aFdac6",
		"pair":      "BTC/USD",
		"price":     w3.I("10000"),
		"quantity":  w3.I("1 ether"),
		"side":      w3.I("0"),
		"orderType": w3.I("1"),
		"orderId":   "1",
	}
}

func HashDomain() ([]byte, error) {
	domainSeparator, err := signatureUserOrder.HashStruct("EIP712Domain", signatureUserOrder.Domain.Map())
	if err != nil {
		return nil, err
	}

	return domainSeparator, nil
}

func HashUserOrder() ([]byte, error) {
	userOrder, err := signatureUserOrder.HashStruct("UserOrder", signatureUserOrder.Message)
	if err != nil {
		return nil, err
	}

	return userOrder, nil
}

func HashOrder() ([]byte, error) {
	userOrder, err := signatureOrder.HashStruct("Order", signatureOrder.Message)
	if err != nil {
		return nil, err
	}

	return userOrder, nil
}

func HashUserOrderWithDomain() (common.Hash, []byte, error) {
	domainSeparator, err := HashDomain()
	if err != nil {
		return common.Hash{}, nil, err
	}
	userOrder, err := HashUserOrder()
	if err != nil {
		return common.Hash{}, nil, err
	}

	rawData := bytes.Join([][]byte{
		{0x19, 0x01},    // EIP-712 version byte
		domainSeparator, // Domain separator
		userOrder,       // Struct hash
	}, nil)

	hashToSign := crypto.Keccak256Hash(rawData)

	return hashToSign, rawData, nil
}

func HashOrderWithDomain() (common.Hash, []byte, error) {
	domainSeparator, err := HashDomain()
	if err != nil {
		return common.Hash{}, nil, err
	}
	order, err := HashOrder()
	if err != nil {
		return common.Hash{}, nil, err
	}

	rawData := bytes.Join([][]byte{
		{0x19, 0x01},    // EIP-712 version byte
		domainSeparator, // Domain separator
		order,           // Struct hash
	}, nil)

	hashToSign := crypto.Keccak256Hash(rawData)

	return hashToSign, rawData, nil
}
