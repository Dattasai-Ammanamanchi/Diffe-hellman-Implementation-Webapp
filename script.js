// Function to check if a number is prime using the Miller-Rabin primality test
function isPrime(n, iterations) {
  if (n <= 1 || n === 4) {
    return false;
  }

  if (n <= 3) {
    return true;
  }

  // Find r and d such that n-1 = 2^r * d
  let d = n - BigInt(1);
  let r = BigInt(0);
  while (d % BigInt(2) === BigInt(0)) {
    d = d / BigInt(2);
    r = r + BigInt(1);
  }

  // Perform Miller-Rabin primality test for the given number of iterations
  for (let i = BigInt(0); i < BigInt(iterations); i++) {
    const a = getRandomBigInt(BigInt(2), n - BigInt(2));
    let x = modPow(a, d, n);

    if (x === BigInt(1) || x === n - BigInt(1)) {
      continue; // Potentially a prime number
    }

    let isComposite = true;
    for (let j = BigInt(1); j < r; j++) {
      x = modPow(x, BigInt(2), n);

      if (x === BigInt(1)) {
        return false; // Composite number
      }

      if (x === n - BigInt(1)) {
        isComposite = false;
        break; // Potentially a prime number
      }
    }

    if (isComposite) {
      return false; // Composite number
    }
  }

  return true; // Probably a prime number
}

  
 // Function to generate a prime number using a combination of probabilistic and deterministic primality tests
 function generatePrime(bits) {
  const min = BigInt(2) ** BigInt(bits - 1);
  const max = (BigInt(2) ** BigInt(bits)) - BigInt(1);

  while (true) {
    const primeCandidate = getRandomBigInt(min, max);
    if (isPrime(primeCandidate, 20)) { // Perform 20 iterations of Miller-Rabin primality test
      return primeCandidate;
    }
  }
}
  
   // Function to generate a random BigInt
function getRandomBigInt(min, max) {
  const range = max - min + BigInt(1);
  const randomValue = BigInt(Math.floor(Math.random() * 2 ** 32)); // Adjust the bit-length as needed
  return (randomValue % range) + min;
}

self.onmessage = (event) => {
  const { bits } = event.data;
  const primeNumber = generatePrime(bits);
  self.postMessage(primeNumber.toString());
};

  
  // Perform the Diffie-Hellman key exchange
  async function diffieHellman() {
    const p = await generatePrime(256); // Generate a 256-bit prime number
    const g = BigInt(2); // Generator
    const a = getRandomBigInt(BigInt(2), p - BigInt(2)); // Private key for Alice
    const b = getRandomBigInt(BigInt(2), p - BigInt(2)); // Private key for Bob
  
    const A = modPow(g, a, p); // Alice's public key
    const B = modPow(g, b, p); // Bob's public key
  
    const sA = modPow(B, a, p); // Alice's shared secret
    const sB = modPow(A, b, p); // Bob's shared secret
  
    document.getElementById('aliceKeys').innerHTML = `
      <p>Private Key: ${a.toString()}</p>
      <p>Public Key: ${A.toString()}</p>
    `;
  
    document.getElementById('bobKeys').innerHTML = `
      <p>Private Key: ${b.toString()}</p>
      <p>Public Key: ${B.toString()}</p>
    `;
  
    document.getElementById('sharedSecret').innerHTML = `
      <p>Alice's Shared Secret: ${sA.toString()}</p>
      <p>Bob's Shared Secret: ${sB.toString()}</p>
    `;
  }
  
 // Modular exponentiation (optimized for BigInt)
 function modPow(base, exponent, modulus) {
  let result = BigInt(1);
  base = base % modulus;
  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    base = (base * base) % modulus;
    exponent = exponent / BigInt(2);
  }
  return result;
}
  