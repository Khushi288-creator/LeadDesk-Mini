import jwt from "jsonwebtoken";

const generateToken = (adminId: string) => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;