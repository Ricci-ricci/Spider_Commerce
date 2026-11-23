"use client";

import Link from "next/link";
import Image from "next/image";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Section } from "@astryxdesign/core/Section";
import { Badge } from "@astryxdesign/core/Badge";
import { Divider } from "@astryxdesign/core/Divider";
import useRealProducts from "./data/fetchProduct";

const HERO_IMAGE = "https://res.cloudinary.com/rz3s0vcd/image/upload/v1795454925/19-893-658-54-692-913.jpg";

export default function Home() {
    const { data: products, loading } = useRealProducts();
    const featured = products.slice(0, 3);
    const trending = products.slice(3, 11);
    const editorial = products.slice(11, 15);

    return (
        <main>
            {/* HERO — full-bleed editorial */}
            <section
                style={{
                    position: "relative",
                    minHeight: "92vh",
                    overflow: "hidden",
                    backgroundColor: "var(--color-background-body)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                    }}
                >
                    <Image
                        src={HERO_IMAGE}
                        alt="Editorial cover"
                        fill
                        priority
                        sizes="100vw"
                        style={{
                            objectFit: "cover",
                            opacity: 0.55,
                            filter: "grayscale(30%)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, var(--color-background-body) 100%)",
                        }}
                    />
                </div>
                <VStack
                    gap={6}
                    padding={10}
                    hAlign="start"
                    vAlign="end"
                    style={{
                        position: "relative",
                        zIndex: 1,
                        minHeight: "92vh",
                        maxWidth: 1400,
                        marginInline: "auto",
                    }}
                >
                    <HStack gap={2}>
                        <Badge label="Winter / 26" variant="neutral" />
                        <Badge label="New arrivals" variant="info" />
                    </HStack>
                    <Heading
                        level={1}
                        type="display-1"
                        textWrap="balance"
                        style={{ maxWidth: "18ch" }}
                    >
                        The quiet shape of things to come.
                    </Heading>
                    <Text
                        type="large"
                        color="secondary"
                        style={{ maxWidth: "52ch" }}
                    >
                        A considered edit of footwear and apparel for people who
                        care about materials, proportion, and the way something
                        lasts. Shot in natural light. Made to be worn.
                    </Text>
                    <HStack gap={3} paddingBlockStart={2}>
                        <Button
                            label="Shop the edit"
                            variant="primary"
                            href="/shop"
                        />
                        <Button
                            label="Read the journal"
                            variant="secondary"
                            href="#journal"
                        />
                    </HStack>
                </VStack>
            </section>

            {/* MARQUEE strip */}
            <Section variant="transparent" padding={0}>
                <HStack
                    gap={6}
                    padding={4}
                    justify="center"
                    style={{
                        borderBlock:
                            "1px solid var(--color-border)",
                        overflowX: "auto",
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        "Free shipping over $200",
                        "30-day returns",
                        "Made in limited runs",
                        "Ethically sourced",
                    ].map((v) => (
                        <Text
                            key={v}
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                            }}
                        >
                            {v}
                        </Text>
                    ))}
                </HStack>
            </Section>

            {/* FEATURED — 3-up editorial */}
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={8}
                    style={{ maxWidth: 1400, marginInline: "auto" }}
                >
                    <HStack justify="between" vAlign="end" wrap="wrap" gap={4}>
                        <VStack gap={1}>
                            <Text
                                type="supporting"
                                color="secondary"
                                style={{
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Chapter 01 — The Edit
                            </Text>
                            <Heading
                                level={2}
                                type="display-3"
                                textWrap="balance"
                            >
                                Three pieces to anchor the season.
                            </Heading>
                        </VStack>
                        <Button
                            label="See all"
                            variant="ghost"
                            href="/shop"
                        />
                    </HStack>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "var(--spacing-5)",
                        }}
                    >
                        {(loading ? Array.from({ length: 3 }) : featured).map(
                            (p, i) => {
                                const product = p as (typeof featured)[number];
                                return (
                                    <Link
                                        key={product?.id ?? i}
                                        href={
                                            product
                                                ? `/shop/${product.id}`
                                                : "#"
                                        }
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        <VStack gap={3}>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    aspectRatio: "3 / 4",
                                                    backgroundColor:
                                                        "var(--color-background-surface)",
                                                    borderRadius:
                                                        "var(--radius-container)",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {product && (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        sizes="(min-width: 1024px) 33vw, 100vw"
                                                        style={{
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <VStack gap={1}>
                                                <HStack
                                                    justify="between"
                                                    vAlign="center"
                                                >
                                                    <Text type="label">
                                                        {product?.title ??
                                                            "—"}
                                                    </Text>
                                                    <Text
                                                        type="label"
                                                        color="secondary"
                                                    >
                                                        $
                                                        {product?.price?.toFixed(
                                                            0,
                                                        ) ?? "—"}
                                                    </Text>
                                                </HStack>
                                                <Text
                                                    type="supporting"
                                                    color="secondary"
                                                >
                                                    {product?.categoryName ??
                                                        ""}
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    </Link>
                                );
                            },
                        )}
                    </div>
                </VStack>
            </Section>

            {/* EDITORIAL break — split image/text */}
            <Section variant="transparent" padding={0}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                        alignItems: "stretch",
                        borderBlock:
                            "1px solid var(--color-border)",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            minHeight: 520,
                            backgroundColor: "var(--color-background-surface)",
                        }}
                    >
                        {editorial[0] && (
                            <Image
                                src={editorial[0].image}
                                alt={editorial[0].title}
                                fill
                                sizes="(min-width: 768px) 50vw, 100vw"
                                style={{ objectFit: "cover" }}
                            />
                        )}
                    </div>
                    <VStack
                        gap={6}
                        padding={10}
                        justify="center"
                        style={{
                            backgroundColor: "var(--color-background-body)",
                        }}
                    >
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            Chapter 02 — Craft
                        </Text>
                        <Heading level={2} type="display-2" textWrap="balance">
                            Nothing extra. Every stitch earns its place.
                        </Heading>
                        <Text
                            type="large"
                            color="secondary"
                            style={{ maxWidth: "48ch" }}
                        >
                            We work with small ateliers across Portugal and
                            Japan. Short runs, slow passes, and a willingness
                            to ship things only when they're right.
                        </Text>
                        <HStack gap={3}>
                            <Button
                                label="Our materials"
                                variant="secondary"
                                href="#"
                            />
                            <Button
                                label="The atelier"
                                variant="ghost"
                                href="#"
                            />
                        </HStack>
                    </VStack>
                </div>
            </Section>

            {/* TRENDING grid */}
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={8}
                    style={{ maxWidth: 1400, marginInline: "auto" }}
                >
                    <VStack gap={1}>
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                            }}
                        >
                            Chapter 03 — What people are wearing
                        </Text>
                        <Heading level={2} type="display-3">
                            Trending now.
                        </Heading>
                    </VStack>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "var(--spacing-5)",
                        }}
                    >
                        {(loading ? Array.from({ length: 8 }) : trending).map(
                            (p, i) => {
                                const product = p as (typeof trending)[number];
                                return (
                                    <Link
                                        key={product?.id ?? i}
                                        href={
                                            product
                                                ? `/shop/${product.id}`
                                                : "#"
                                        }
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
                                                {product && (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                                        style={{
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <HStack
                                                justify="between"
                                                vAlign="center"
                                            >
                                                <Text
                                                    type="supporting"
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {product?.title ?? "—"}
                                                </Text>
                                                <Text
                                                    type="supporting"
                                                    color="secondary"
                                                >
                                                    $
                                                    {product?.price?.toFixed(
                                                        0,
                                                    ) ?? "—"}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Link>
                                );
                            },
                        )}
                    </div>
                </VStack>
            </Section>

            {/* JOURNAL — newsletter */}
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={6}
                    hAlign="center"
                    padding={8}
                    style={{
                        maxWidth: 820,
                        marginInline: "auto",
                        textAlign: "center",
                        borderRadius: "var(--radius-page)",
                        backgroundColor: "var(--color-background-surface)",
                    }}
                >
                    <Text
                        type="supporting"
                        color="secondary"
                        style={{
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                        }}
                    >
                        The Journal
                    </Text>
                    <Heading
                        level={2}
                        type="display-3"
                        justify="center"
                        textWrap="balance"
                    >
                        A quiet letter. Once a month. Nothing more.
                    </Heading>
                    <Text type="body" color="secondary" justify="center">
                        New drops, behind-the-scenes from the atelier, and the
                        occasional long read on materials.
                    </Text>
                    <HStack
                        gap={2}
                        style={{ width: "100%", maxWidth: 440 }}
                    >
                        <input
                            type="email"
                            placeholder="you@example.com"
                            style={{
                                flex: 1,
                                padding:
                                    "var(--spacing-3) var(--spacing-4)",
                                borderRadius: "var(--radius-element)",
                                border:
                                    "1px solid var(--color-border)",
                                backgroundColor:
                                    "var(--color-background-body)",
                                color: "var(--color-text-primary)",
                                fontFamily: "inherit",
                                fontSize: "inherit",
                            }}
                        />
                        <Button label="Subscribe" variant="primary" />
                    </HStack>
                </VStack>
            </Section>

            <Divider />
        </main>
    );
}
