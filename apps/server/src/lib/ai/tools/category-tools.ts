import { tool } from "ai";
import { db } from "@/db";
import { categoriesTable, coursesTable } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { logger } from "@/lib/logger";
import {
  listCategoriesSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "./schemas";
import { setCacheWithLimit, type ToolContext } from "./utils";

export function createCategoryTools(ctx: ToolContext) {
  const { tenantId, searchCache } = ctx;

  return {
    listCategories: tool({
      description: "List available categories to assign to the course.",
      inputSchema: listCategoriesSchema,
      execute: async ({ limit }) => {
        const cacheKey = `categories:${limit ?? 20}`;
        const cached = searchCache.get(cacheKey);
        if (cached) {
          logger.info("listCategories cache hit");
          return cached;
        }

        const categories = await db
          .select({
            id: categoriesTable.id,
            name: categoriesTable.name,
            slug: categoriesTable.slug,
          })
          .from(categoriesTable)
          .where(eq(categoriesTable.tenantId, tenantId))
          .limit(limit ?? 20);

        const result = { categories, count: categories.length };
        setCacheWithLimit(searchCache, cacheKey, result);
        logger.info("listCategories executed", { found: categories.length });
        return result;
      },
    }),

    createCategory: tool({
      description: "Create a new category. Use this when the user wants to create a new category that doesn't exist.",
      inputSchema: createCategorySchema,
      execute: async ({ name, description }) => {
        const slug = name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const existing = await db
          .select({ id: categoriesTable.id })
          .from(categoriesTable)
          .where(and(eq(categoriesTable.tenantId, tenantId), eq(categoriesTable.slug, slug)))
          .limit(1);

        if (existing.length > 0) {
          return { type: "error" as const, error: `Category "${name}" already exists` };
        }

        const [maxOrder] = await db
          .select({ maxOrder: categoriesTable.order })
          .from(categoriesTable)
          .where(eq(categoriesTable.tenantId, tenantId))
          .orderBy(desc(categoriesTable.order))
          .limit(1);

        const [category] = await db
          .insert(categoriesTable)
          .values({
            tenantId,
            name,
            slug,
            description: description ?? null,
            order: (maxOrder?.maxOrder ?? -1) + 1,
          })
          .returning();

        for (const key of searchCache.keys()) {
          if (key.startsWith("categories:")) searchCache.delete(key);
        }

        logger.info("createCategory executed", { categoryId: category.id, name: category.name });
        return { type: "category_created" as const, id: category.id, name: category.name, slug: category.slug };
      },
    }),

    updateCategory: tool({
      description: "Update an existing category's name or description.",
      inputSchema: updateCategorySchema,
      execute: async ({ categoryId, name, description }) => {
        const [existing] = await db
          .select({ id: categoriesTable.id, name: categoriesTable.name })
          .from(categoriesTable)
          .where(and(eq(categoriesTable.tenantId, tenantId), eq(categoriesTable.id, categoryId)))
          .limit(1);

        if (!existing) {
          return { type: "error" as const, error: "Category not found" };
        }

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) {
          updateData.name = name;
          updateData.slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
        if (description !== undefined) updateData.description = description;

        if (Object.keys(updateData).length === 0) {
          return { type: "error" as const, error: "No fields to update" };
        }

        await db.update(categoriesTable).set(updateData).where(eq(categoriesTable.id, categoryId));

        for (const key of searchCache.keys()) {
          if (key.startsWith("categories:")) searchCache.delete(key);
        }

        logger.info("updateCategory executed", { categoryId });
        return { type: "category_updated" as const, categoryId, updatedFields: Object.keys(updateData) };
      },
    }),

    deleteCategory: tool({
      description: "Delete a category. Requires confirmation. Courses in this category will have their category removed.",
      inputSchema: deleteCategorySchema,
      execute: async ({ categoryId, confirmed }) => {
        const [existing] = await db
          .select({ id: categoriesTable.id, name: categoriesTable.name })
          .from(categoriesTable)
          .where(and(eq(categoriesTable.tenantId, tenantId), eq(categoriesTable.id, categoryId)))
          .limit(1);

        if (!existing) {
          return { type: "error" as const, error: "Category not found" };
        }

        const [courseCount] = await db
          .select({ count: count() })
          .from(coursesTable)
          .where(eq(coursesTable.categoryId, categoryId));

        if (!confirmed) {
          return {
            type: "confirmation_required" as const,
            action: "delete_category",
            categoryId,
            categoryName: existing.name,
            message: `Are you sure you want to delete "${existing.name}"?`,
            warning: courseCount.count > 0 ? `${courseCount.count} courses will have their category removed.` : undefined,
          };
        }

        await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId));

        for (const key of searchCache.keys()) {
          if (key.startsWith("categories:")) searchCache.delete(key);
        }

        logger.info("deleteCategory executed", { categoryId, name: existing.name });
        return { type: "category_deleted" as const, categoryId, name: existing.name };
      },
    }),
  };
}
