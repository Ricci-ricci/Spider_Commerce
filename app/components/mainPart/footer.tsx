"use client";

import Link from "next/link";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Section } from "@astryxdesign/core/Section";
import { Instagram, Twitter, Facebook } from "lucide-react";

const COLUMNS = [
    {
        title: "Shop",
        items: [
            { label: "All", href: "/shop" },
            { label: "Running", href: "/shop?category=Running" },
            { label: "Lifestyle", href: "/shop?category=Lifestyle" },
            { label: "Basketball", href: "/shop?category=Basketball" },
        ],
    },
    {
        title: "The House",
        items: [
            { label: "About", href: "#" },
            { label: "Journal", href: "#" },
            { label: "Materials", href: "#" },
            { label: "Ateliers", href: "#" },
        ],
    },
    {
        title: "Service",
        items: [
            { label: "Shipping", href: "#" },
            { label: "Returns", href: "#" },
            { label: "Size guide", href: "#" },
            { label: "Contact", href: "/contact" },
        ],
    },
];

export default function FooterPart1() {
    return (
        <footer
            style={{
                marginBlockStart: "var(--spacing-10)",
                borderBlockStart:
                    "1px solid var(--color-border)",
                backgroundColor: "var(--color-background-surface)",
            }}
        >
            <Section variant="transparent" padding={10}>
                <VStack
                    gap={10}
                    style={{ maxWidth: 1400, marginInline: "auto" }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(260px, 2fr) repeat(3, minmax(160px, 1fr))",
                            gap: "var(--spacing-8)",
                        }}
                    >
                        <VStack gap={4}>
                            <Text
                                type="supporting"
                                color="secondary"
                                style={{
                                    letterSpacing: "0.22em",
                                    textTransform: "uppercase",
                                }}
                            >
                                SpiderSense
                            </Text>
                            <Heading
                                level={2}
                                type="display-3"
                                textWrap="balance"
                                style={{ maxWidth: "18ch" }}
                            >
                                Be the best version of you.
                            </Heading>
                            <Text
                                type="body"
                                color="secondary"
                                style={{ maxWidth: "36ch" }}
                            >
                                A quiet letter, once a month. New drops,
                                materials and the occasional long read.
                            </Text>
                        </VStack>
                        {COLUMNS.map((col) => (
                            <VStack key={col.title} gap={3}>
                                <Text
                                    type="supporting"
                                    color="secondary"
                                    style={{
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {col.title}
                                </Text>
                                <VStack gap={2}>
                                    {col.items.map((it) => (
                                        <Link
                                            key={it.label}
                                            href={it.href}
                                            style={{
                                                textDecoration: "none",
                                                color: "var(--color-text-primary)",
                                            }}
                                        >
                                            <Text type="body">{it.label}</Text>
                                        </Link>
                                    ))}
                                </VStack>
                            </VStack>
                        ))}
                    </div>
                    <div
                        style={{
                            height: 1,
                            backgroundColor:
                                "var(--color-border)",
                        }}
                    />
                    <HStack
                        justify="between"
                        vAlign="center"
                        wrap="wrap"
                        gap={4}
                    >
                        <Text type="supporting" color="secondary">
                            © {new Date().getFullYear()} SpiderSense. All
                            rights reserved.
                        </Text>
                        <HStack gap={3} vAlign="center">
                            <a
                                href="#"
                                aria-label="Instagram"
                                style={{
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                style={{
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                aria-label="Facebook"
                                style={{
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                <Facebook size={18} />
                            </a>
                        </HStack>
                    </HStack>
                </VStack>
            </Section>
        </footer>
    );
}
