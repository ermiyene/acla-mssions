import { AuthUser } from "../dtos/auth.dto";
import { jwtVerify, SignJWT } from "jose";

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET || JWT_SECRET.length < 10) {
    throw new Error("Invalid JWT secret.");
  }

  return JWT_SECRET;
}

export async function signJWT(user: AuthUser) {
  const secret = getJwtSecret();

  try {
    // TODO: Add refresh token and set a shorter expiration time for the access token so that if the user logs out the access token will be invalidated in a shorter time. The refresh token will be used to get a new access token before the access token expires so that the user remains logged in until they intentionally log out.
    const token = await new SignJWT({ user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    return token;
  } catch (error) {
    throw new Error("Error signing JWT.");
  }
}

export async function verifyJWT(token: string) {
  const secret = getJwtSecret();

  try {
    const decodedUser = await jwtVerify<{ user: AuthUser }>(
      token,
      new TextEncoder().encode(secret)
    );
    return decodedUser.payload;
  } catch (error) {
    throw new Error("Invalid token.");
  }
}
