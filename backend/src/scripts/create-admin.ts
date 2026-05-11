import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
        data: {
            email: "admin@example.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("✅ Admin created:");
    console.log(admin);
}

main()
    .catch((err) => {
        console.error(err);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });