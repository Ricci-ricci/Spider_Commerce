"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Section } from "@astryxdesign/core/Section";
import { Badge } from "@astryxdesign/core/Badge";
import AddToCartButton from "@/app/components/productPart/AddToCartButton";
import { RealProduct } from "@/app/data/fetchProduct";

export default function Page({
    params,
}: {
    params: Promise<{ product: string }>;
}) {
    const { product: productId } = use(params);
    const [product, setProduct] = useState<RealProduct | null>(null);
    const [all, setAll] = useState<RealProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [oneRes, allRes] = await Promise.all([
                    fetch(`/api/products/${productId}`),
                    fetch(`/api/products`),
                ]);
                if (cancelled) return;
                if (oneRes.ok) {
                    const body = await oneRes.json();
                    setProduct(body.data ?? null);
                }
                if (allRes.ok) {
                    const body = await allRes.json();
                    setAll(body.data ?? []);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [productId]);

    if (loading) {
        return (
            <main style={{ padding: "4rem", textAlign: "center" }}>
                <Text type="body">Loading…</Text>
            </main>
        );
    }

    if (!product) {
        return (
            <main style={{ padding: "4rem", textAlign: "center" }}>
                <Heading level={1} type="display-3">
                    Product not found
                </Heading>
                <Link href="/shop">
                    <Text type="body" color="accent">
                        Back to shop
                    </Text>
                </Link>
            </main>
        );
    }

    const related = all
        .filter(
            (p) =>
                p.id !== product.id && p.categoryName === product.categoryName,
        )
        .slice(0, 4);

    const rating = Math.max(0, Math.min(5, Number(product.rating ?? 0)));
    const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

    return (
        <main>
            {/* BREADCRUMB */}
            <Section variant="transparent" padding={0}>
                <HStack
                    gap={2}
                    padding={6}
                    style={{ maxWidth: 1400, marginInline: "auto" }}
                >
                    <Link
                        href="/"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Text type="supporting" color="secondary">
                            Home
                        </Text>
                    </Link>
                    <Text type="supporting" color="secondary">
                        /
                    </Text>
                    <Link
                        href="/shop"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Text type="supporting" color="secondary">
                            Shop
                        </Text>
                    </Link>
                    <Text type="supporting" color="secondary">
                        /
                    </Text>
                    <Text type="supporting">{product.title}</Text>
                </HStack>
            </Section>

            {/* HERO — image left, buy box right */}
            <Section variant="transparent" padding={0}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(380px, 1fr))",
                        gap: "var(--spacing-8)",
                        maxWidth: 1400,
                        marginInline: "auto",
                        paddingInline: "var(--spacing-6)",
                        paddingBottom: "var(--spacing-10)",
                        alignItems: "start",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            aspectRatio: "4 / 5",
                            backgroundColor: "var(--color-background-surface)",
                            borderRadius: "var(--radius-page)",
                            overflow: "hidden",
                        }}
                    >
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            priority
                            sizes="(min-width: 768px) 50vw, 100vw"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <VStack
                        gap={5}
                        style={{ position: "sticky", top: "var(--spacing-6)" }}
                    >
                        <VStack gap={2}>
                            <HStack gap={2}>
                                <Badge
                                    label={product.categoryName}
                                    variant="neutral"
                                />
                                {product.stock > 0 ? (
                                    <Badge label="In stock" variant="success" />
                                ) : (
                                    <Badge label="Sold out" variant="error" />
                                )}
                            </HStack>
                            <Heading
                                level={1}
                                type="display-2"
                                textWrap="balance"
                            >
                                {product.title}
                            </Heading>
                            <HStack gap={2} vAlign="center">
                                <Text
                                    type="large"
                                    color="accent"
                                    style={{ letterSpacing: "0.08em" }}
                                >
                                    {stars}
                                </Text>
                                <Text type="supporting" color="secondary">
                                    {rating.toFixed(1)} rating
                                </Text>
                            </HStack>
                        </VStack>
                        <Heading level={2} type="display-3">
                            ${product.price.toFixed(2)}
                        </Heading>
                        <Text type="body" color="secondary">
                            {product.description}
                        </Text>
                        <AddToCartButton product={product} />
                        {product.features && product.features.length > 0 && (
                            <VStack gap={2} paddingBlockStart={3}>
                                <Text
                                    type="supporting"
                                    color="secondary"
                                    style={{
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Details
                                </Text>
                                <ul
                                    style={{
                                        margin: 0,
                                        paddingInlineStart: "var(--spacing-5)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--spacing-1)",
                                    }}
                                >
                                    {product.features.map((f) => (
                                        <li key={f}>
                                            <Text type="body">{f}</Text>
                                        </li>
                                    ))}
                                </ul>
                            </VStack>
                        )}
                        <VStack gap={2} paddingBlockStart={3}>
                            <HStack gap={3} justify="between">
                                <Text type="supporting" color="secondary">
                                    Shipping
                                </Text>
                                <Text type="supporting">
                                    Free over $200 · 3–5 business days
                                </Text>
                            </HStack>
                            <HStack gap={3} justify="between">
                                <Text type="supporting" color="secondary">
                                    Returns
                                </Text>
                                <Text type="supporting">30 days, on us</Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </div>
            </Section>

            {/* RELATED */}
            {related.length > 0 && (
                <Section variant="transparent" padding={10}>
                    <VStack
                        gap={6}
                        style={{ maxWidth: 1400, marginInline: "auto" }}
                    >
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            More from {product.categoryName}
                        </Text>
                        <Heading level={2} type="display-3">
                            You might also like.
                        </Heading>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "var(--spacing-5)",
                            }}
                        >
                            {related.map((r) => (
                                <Link
                                    key={r.id}
                                    href={`/shop/${r.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <VStack gap={2}>
                                        <div
                                            style={{
                                                position: "relative",
                                                aspectRatio: "1 / 1",
                                                backgroundColor:
                                                    "var(--color-background-surface)",
                                                borderRadius:
                                                    "var(--radius-element)",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Image
                                                src={r.image}
                                                alt={r.title}
                                                fill
                                                sizes="(min-width: 1024px) 25vw, 50vw"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                        <HStack justify="between">
                                            <Text type="label" maxLines={1}>
                                                {r.title}
                                            </Text>
                                            <Text
                                                type="label"
                                                color="secondary"
                                            >
                                                ${r.price.toFixed(0)}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Link>
                            ))}
                        </div>
                    </VStack>
                </Section>
            )}
        </main>
    );
}
