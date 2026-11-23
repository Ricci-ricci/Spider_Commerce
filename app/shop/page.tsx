"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Section } from "@astryxdesign/core/Section";
import { Badge } from "@astryxdesign/core/Badge";
import useRealProducts, { type RealProduct } from "../data/fetchProduct";

type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

function ShopInner() {
    const searchParams = useSearchParams();
    const { data, loading } = useRealProducts();
    const [selectedCats, setSelectedCats] = useState<string[]>([]);
    const [sort, setSort] = useState<SortKey>("newest");
    const [priceMax, setPriceMax] = useState<number>(1000);

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setSelectedCats([cat]);
    }, [searchParams]);

    const categories = useMemo(
        () => Array.from(new Set(data.map((p) => p.categoryName))).sort(),
        [data],
    );

    const filtered = useMemo(() => {
        const result = data.filter((p) => {
            const inCat =
                selectedCats.length === 0 ||
                selectedCats.includes(p.categoryName);
            const inPrice = p.price <= priceMax;
            return inCat && inPrice;
        });
        const sorted = [...result];
        switch (sort) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
        }
        return sorted;
    }, [data, selectedCats, sort, priceMax]);

    const toggleCat = (c: string) => {
        setSelectedCats((prev) =>
            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
        );
    };

    return (
        <main>
            {/* EDITORIAL HEADER */}
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
                        The archive — {data.length} pieces
                    </Text>
                    <Heading level={1} type="display-1" textWrap="balance">
                        Shop the whole collection.
                    </Heading>
                    <Text
                        type="large"
                        color="secondary"
                        style={{ maxWidth: "60ch" }}
                    >
                        Everything available right now, organised by category.
                        Filter, sort, and take your time.
                    </Text>
                </VStack>
            </Section>

            {/* FILTER BAR */}
            <Section variant="transparent" padding={0}>
                <VStack
                    gap={4}
                    padding={6}
                    style={{
                        maxWidth: 1400,
                        marginInline: "auto",
                        borderBlock:
                            "1px solid var(--color-border)",
                    }}
                >
                    <HStack gap={2} wrap="wrap" vAlign="center">
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                marginInlineEnd: "var(--spacing-2)",
                            }}
                        >
                            Category
                        </Text>
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => toggleCat(c)}
                                style={{
                                    all: "unset",
                                    cursor: "pointer",
                                }}
                            >
                                <Badge
                                    label={c}
                                    variant={
                                        selectedCats.includes(c)
                                            ? "info"
                                            : "neutral"
                                    }
                                />
                            </button>
                        ))}
                        {selectedCats.length > 0 && (
                            <Button
                                label="Clear"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCats([])}
                            />
                        )}
                    </HStack>
                    <HStack gap={4} wrap="wrap" vAlign="center">
                        <HStack gap={2} vAlign="center">
                            <Text
                                type="supporting"
                                color="secondary"
                                style={{
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Sort
                            </Text>
                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value as SortKey)
                                }
                                style={{
                                    padding: "var(--spacing-1) var(--spacing-3)",
                                    borderRadius: "var(--radius-element)",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor:
                                        "var(--color-background-body)",
                                    color: "var(--color-text-primary)",
                                    fontFamily: "inherit",
                                }}
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">
                                    Price — low to high
                                </option>
                                <option value="price-desc">
                                    Price — high to low
                                </option>
                                <option value="rating">Best rated</option>
                            </select>
                        </HStack>
                        <HStack gap={2} vAlign="center">
                            <Text
                                type="supporting"
                                color="secondary"
                                style={{
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Max price
                            </Text>
                            <input
                                type="range"
                                min={0}
                                max={1000}
                                value={priceMax}
                                onChange={(e) =>
                                    setPriceMax(Number(e.target.value))
                                }
                                style={{ width: 160 }}
                            />
                            <Text type="supporting">${priceMax}</Text>
                        </HStack>
                        <Text
                            type="supporting"
                            color="secondary"
                            style={{ marginInlineStart: "auto" }}
                        >
                            {filtered.length} result
                            {filtered.length === 1 ? "" : "s"}
                        </Text>
                    </HStack>
                </VStack>
            </Section>

            {/* GRID */}
            <Section variant="transparent" padding={10}>
                <div
                    style={{
                        maxWidth: 1400,
                        marginInline: "auto",
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "var(--spacing-5)",
                    }}
                >
                    {(loading ? Array.from({ length: 12 }) : filtered).map(
                        (p, i) => {
                            const product = p as RealProduct | undefined;
                            return (
                                <Link
                                    key={product?.id ?? i}
                                    href={
                                        product ? `/shop/${product.id}` : "#"
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
                                                aspectRatio: "4 / 5",
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
                                                    sizes="(min-width: 1024px) 25vw, 50vw"
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
                                                <Text
                                                    type="label"
                                                    maxLines={1}
                                                >
                                                    {product?.title ?? "—"}
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
                                                {product?.categoryName ?? ""}
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Link>
                            );
                        },
                    )}
                </div>
                {!loading && filtered.length === 0 && (
                    <VStack
                        gap={3}
                        hAlign="center"
                        padding={10}
                        style={{ maxWidth: 480, marginInline: "auto" }}
                    >
                        <Heading level={3} type="display-3">
                            Nothing here.
                        </Heading>
                        <Text type="body" color="secondary" justify="center">
                            Your filters are a little strict. Clear them and
                            we'll show you everything we have.
                        </Text>
                        <Button
                            label="Clear filters"
                            variant="primary"
                            onClick={() => {
                                setSelectedCats([]);
                                setPriceMax(1000);
                            }}
                        />
                    </VStack>
                )}
            </Section>
        </main>
    );
}

export default function Shop() {
    return (
        <Suspense>
            <ShopInner />
        </Suspense>
    );
}
