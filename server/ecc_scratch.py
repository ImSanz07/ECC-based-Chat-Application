import random
import hashlib
import sys


# Define elliptic curve parameters
a = -1
b = 1
p = 17  # Prime modulus
base_point = (5, 1)  # A base point on the curve


def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    else:
        d, x, y = extended_gcd(b, a % b)
        return d, y, x - (a // b) * y


def mod_inv(a, m):
    d, x, _ = extended_gcd(a, m)
    if d != 1:
        raise ValueError("Modular inverse does not exist")
    else:
        return x % m


def add_points(p1, p2):
    # Point addition on the curve
    if p1 == "O":
        return p2
    if p2 == "O":
        return p1
    
    x1, y1 = p1
    x2, y2 = p2
    
    if p1 == p2:
        # Point doubling
        numerator = (3 * x1**2 + a) % p
        denominator = (2 * y1) % p
    else:
        # Point addition
        numerator = (y2 - y1) % p
        denominator = (x2 - x1) % p
    
    # Calculate the modular inverse manually
    inv_denominator = mod_inv(denominator, p) if denominator != 0 else 0
    
    slope = (numerator * inv_denominator) % p
    
    x3 = (slope**2 - x1 - x2) % p
    y3 = (slope * (x1 - x3) - y1) % p
    
    return (x3, y3)


def scalar_multiply(k, point):
    # Scalar multiplication k*point on the curve
    result = "O"
    for _ in range(k):
        result = add_points(result, point)
    return result


def generate_keypair():
    # Generate a private key (random integer) and corresponding public key (point)
    private_key = random.randint(1, p - 1)
    public_key = scalar_multiply(private_key, base_point)
    return private_key, public_key


def sign_message(private_key, message):
    # Sign a message using ECC
    k = random.randint(1, p - 1)  # Choose a random integer k
    k_point = scalar_multiply(k, base_point)
    r = k_point[0] % p
    
    message_hash = int.from_bytes(hashlib.md5(message.encode()).digest(), byteorder='big')  # Use MD5 hash
    
    k_inverse = mod_inv(k, p)
    s = (k_inverse * (message_hash + private_key * r)) % p
    
    return (r, s)


def verify_signature(public_key, message, signature):
    # Verify a digital signature
    r, s = signature
    if not (0 < r < p and 0 < s < p):
        return False
    
    message_hash = int.from_bytes(hashlib.md5(message.encode()).digest(), byteorder='big')  # Use MD5 hash
    w = mod_inv(s, p)
    u1 = (message_hash * w) % p
    u2 = (r * w) % p
    
    u1G = scalar_multiply(u1, base_point)
    u2Q = scalar_multiply(u2, public_key)
    
    total = add_points(u1G, u2Q)
    
    return total[0] % p == r



# Example usage


# private_key, public_key = generate_keypair()
# message = "Hello, world!"
# signature = sign_message(private_key, message)
# print("Signature:", signature)
# print("Verification result:", verify_signature(public_key, message, signature))









