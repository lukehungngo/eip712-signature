package eip712

import (
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/rmsrob/go-eip712-signature/pkg/wallet"
)

func SignOrderWithPrivateKey(dataToSign []byte) {
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

	fmt.Printf("Js Signat: %s\n", "0x10e509ab476004ad607532c2e8629de1153803e06afbba9451d3a09b3ec6e72330ade8f90c51161a6e4b844ed06557318b58ce9d32441a61a06e8a44c7abce301b")
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

func SignOrder() {
	// Calculate EIP-712 domain separator
	domain, err := HashDomain()
	if err != nil {
		fmt.Printf("error: %+v", err)
	}

	fmt.Printf("domainSeparator: 0x%s\n", common.Bytes2Hex(domain))
	fmt.Printf("expected domain: 0xe09f678c0990499685aa1fd3071947345fbe5f526e3f1e404415568ec4c0fef4\n")

	// Calculate EIP-712 struct hash for Order
	order, err := HashOrder()
	if err != nil {
		fmt.Printf("error: %+v", err)
	}
	fmt.Println("----")
	fmt.Printf("userOrder: 0x%s\n", common.Bytes2Hex(order))
	fmt.Printf("expected : 0x86b265fe4e42471ce4d5a2611b6878626ea4236491a498b79ea8761f5efddfe2\n")

	// Calculate the hash of the entire message by concatenating the domain separator and order hashes
	rawHash, rawBytes, err := HashOrderWithDomain()
	if err != nil {
		fmt.Printf("error: %+v", err)
	}
	fmt.Println("")
	fmt.Printf("raw Hash: %s\n", rawHash)
	fmt.Printf("expected: 0x7fb7f11b742eea78541fa27a03cdf6137403e7ed79c4174e5a1008949801ea39\n")

	// Sign the hash
	fmt.Println("----")
	SignOrderWithPrivateKey(rawBytes)
}
