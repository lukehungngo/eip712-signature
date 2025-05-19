package eip712

import (
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/rmsrob/go-eip712-signature/pkg/wallet"
)

func SignUserOrderWithPrivateKey(dataToSign []byte) {
	privateKey := wallet.GetAccount().PrivateKey

	hash := crypto.Keccak256(dataToSign)

	signature, err := crypto.Sign(hash, privateKey)
	if err != nil {
		log.Fatalf("failed to sign: %v", err)
	}

	// Split signature
	r := new(big.Int).SetBytes(signature[:32])
	s := new(big.Int).SetBytes(signature[32:64])
	v := signature[64] + 27 // signature[crypto.RecoveryIDOffset] += 27

	fmt.Printf("Js signat: %s\n", "0x11a7a0cd689334a0d6ef9039579a78ae57e71e32f90c28e1e8fbfc6d6f49c46963017ab1f06ac8f087a615e03df161683768d5da286fd3a836e51ec00fbee2a41b")
	fmt.Printf("Signature: 0x%s\n", common.Bytes2Hex(signature))
	fmt.Printf("R: %s\n", r.Text(16))
	fmt.Printf("S: %s\n", s.Text(16))
	fmt.Printf("V: %d\n", v)

	pubKey, err := crypto.SigToPub(hash, signature)
	if err != nil {
		log.Fatalf("could not recover pubkey: %v", err)
	}
	recoveredAddr := crypto.PubkeyToAddress(*pubKey)
	fmt.Printf("Recover: %s\n", recoveredAddr.Hex())

	fmt.Printf("Signer : %v\n", wallet.GetAccount().FromAddress.Hex())
}

func SignUserOrder() {
	// Calculate EIP-712 domain separator
	domain, err := HashDomain()
	if err != nil {
		fmt.Printf("error: %+v", err)
	}

	fmt.Printf("domainSeparator: 0x%s\n", common.Bytes2Hex(domain))
	fmt.Printf("expected domain: 0xe09f678c0990499685aa1fd3071947345fbe5f526e3f1e404415568ec4c0fef4\n")

	// Calculate EIP-712 struct hash for UserOrder
	userOrder, err := HashUserOrder()
	if err != nil {
		fmt.Printf("error: %+v", err)
	}
	fmt.Println("----")
	fmt.Printf("userOrder: 0x%s\n", common.Bytes2Hex(userOrder))
	fmt.Printf("expected : 0x82e6f72dc84952903e1cadf5c7075cb11bacd4a6b9d6a39a2b5561195f989887\n")

	// Calculate the hash of the entire message by concatenating the domain separator and user order hashes
	rawHash, rawBytes, err := HashUserOrderWithDomain()
	if err != nil {
		fmt.Printf("error: %+v", err)
	}
	fmt.Println("")
	fmt.Printf("raw Hash: %s\n", rawHash)
	fmt.Printf("expected: 0xe8914527c3253c4446999aad0dfd2bee90f94da648bbaad27e8ee5f7945353be\n")

	// Sign the hash
	fmt.Println("----")
	SignUserOrderWithPrivateKey(rawBytes)
}
