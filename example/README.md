# Signature


ECDSA signatures are non-deterministic by default. Even if the message and key are the same, different libraries (like Go and JS) will often produce different signature bytes due to randomness in the signing process.

ECDSA (the algorithm Ethereum uses for signing) requires generating a random number k during the signing process. This means:
	•	Same input message
	•	Same private key
	•	Will produce different r, s, and v values, unless the signing algorithm is deterministic (e.g., RFC 6979 — used by secp256k1 in some contexts).

Unless your signer uses a fixed deterministic nonce (k), each signature is different but still valid.

Because the important part is that:
	•	r, s, and v encode a valid point on the curve.
	•	The message hash is the same.
	•	The public key can still be recovered from the signature.