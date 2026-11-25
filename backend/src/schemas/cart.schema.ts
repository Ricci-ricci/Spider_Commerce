import { z } from "zod";

// Note: userId is NEVER in the request body/params — it comes from the auth
// cookie via the `authenticate` middleware (req.user.userId). Letting the
// client pass userId would be a horizontal privilege escalation.

export const addToCartSchema = z.object({
    body: z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
    }),
});

export const updateCartItemSchema = z.object({
    params: z.object({
        itemId: z.string().min(1, "Item ID is required"),
    }),
    body: z.object({
        quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
    }),
});

export const getCartSchema = z.object({});

export const removeCartItemSchema = z.object({
    params: z.object({
        itemId: z.string().min(1, "Item ID is required"),
    }),
});

export const clearCartSchema = z.object({});
