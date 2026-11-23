import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

if (process.env.CLOUDINARY_URL) {
    cloudinary.config(true);
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}
console.log("Cloudinary cloud:", cloudinary.config().cloud_name);

const prisma = new PrismaClient();

const basename = (p: string) =>
    p.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";

async function main() {
    const { resources } = await cloudinary.search
        .expression("resource_type:image")
        .max_results(500)
        .execute();

    const byName = new Map<string, string>();
    for (const r of resources) {
        byName.set(basename(r.public_id), r.secure_url);
    }

    const products = await prisma.product.findMany();
    let updated = 0;
    let missing: string[] = [];

    for (const p of products) {
        if (!p.image || p.image.startsWith("https://res.cloudinary.com")) continue;
        const key = basename(p.image);
        const newUrl = byName.get(key);
        if (!newUrl) {
            missing.push(`${p.id} -> ${p.image}`);
            continue;
        }
        await prisma.product.update({
            where: { id: p.id },
            data: { image: newUrl },
        });
        updated++;
        console.log(`OK ${p.title}: ${newUrl}`);
    }

    console.log(`\nUpdated: ${updated}`);
    if (missing.length) {
        console.log(`Missing (${missing.length}):`);
        missing.forEach((m) => console.log("  " + m));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
