// Super simple Elliptic Curve Presentation in Python
//   https://www.mobilefish.com/download/cryptocurrency/bitcoin_ec_key_generation.py.txt

type Point = [bigint, bigint];

const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const A = 0n;
const B = 7n;
const X = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
const Y = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;
const G = [X, Y] as Point;

function modinv(a: bigint, n = P) {
  let [lm, hm] = [1n, 0n];
  let [low, high] = [mod(a, n), n];

  while (low > 1n) {
    const ratio = high / low;
    const [nm, nw] = [hm - lm * ratio, high - low * ratio];

    [lm, low, hm, high] = [nm, nw, lm, low];
  }
  return mod(lm, n);
}

function ecAdd(a: Point, b: Point) {
  const lam = mod((b[1] - a[1]) * modinv(b[0] - a[0]), P);
  const x = mod(lam * lam - a[0] - b[0], P);
  const y = mod(lam * (a[0] - x) - a[1], P);

  return [x, y] as Point;
}

function ecDouble(a: Point) {
  const lam = mod((3n * a[0] * a[0] + A) * modinv(2n * a[1]), P);
  const x = mod(lam * lam - 2n * a[0], P);
  const y = mod(lam * (a[0] - x) - a[1], P);

  return [x, y] as Point;
}

function ecMultiply(g: Point, scalar: bigint) {
  if (scalar === 0n || scalar >= N) {
    throw new Error('invalid scalar');
  }

  const b = scalar.toString(2);
  let Q = g;
  for (let i = 1; i < b.length; i += 1) {
    Q = ecDouble(Q);
    if (b[i] === '1') {
      Q = ecAdd(Q, g);
    }
  }
  return Q;
}

function generateRandomBigInt(max: bigint) {
  return (BigInt(Math.round(Math.random() * 1e16)) * max) / BigInt(1e16);
}

function mod(n: bigint, m: bigint) {
  return ((n % m) + m) % m;
}

function printHex(n: bigint) {
  console.log(`0x${n.toString(16)}`);
}

const priKey = generateRandomBigInt(N);
const [x, y] = ecMultiply(G, priKey);

printHex(priKey);
printHex(x);
printHex(y);
