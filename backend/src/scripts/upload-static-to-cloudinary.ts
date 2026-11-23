import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

if (process.env.CLOUDINARY_URL) cloudinary.config(true);

const STATIC_DIR = path.resolve(process.cwd(), "../public/images");

async function main() {
    const files = fs.readdirSync(STATIC_DIR);
    const out: Record<string, string> = {};
    for (const f of files) {
        const full = path.join(STATIC_DIR, f);
        if (!fs.statSync(full).isFile()) continue;
        const publicId = "static/" + f.replace(/\.[^.]+$/, "").replace(/\s+/g, "_").replace(/[()]/g, "");
        try {
            const r = await cloudinary.uploader.upload(full, {
                public_id: publicId,
                overwrite: true,
                resource_type: "image",
            });
            out[f] = r.secure_url;
            console.log(`OK ${f} -> ${r.secure_url}`);
        } catch (e: any) {
            console.log(`FAIL ${f}: ${e.message}`);
        }
    }

    const { resources } = await cloudinary.search
        .expression("public_id:19-893-658-54-692-913 OR public_id:9-404-638-236-239-592")
        .max_results(10)
        .execute();
    for (const r of resources) {
        const key = r.public_id.split("/").pop() + ".jpeg";
        out[key] = r.secure_url;
        console.log(`PRODUCT ${key} -> ${r.secure_url}`);
    }

    console.log("\n=== MAP ===");
    console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
