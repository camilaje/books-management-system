import { Request, Response } from "express";
import { AppDataSource } from "../../config/db";
import { Book } from "./book.entity";
import { logger } from "../../config/logger";

export const BookController = {
  create: async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Book);

      const payload = {
        title: String(req.body.title ?? "").trim(),
        author: String(req.body.author ?? "").trim(),
        year: Number(req.body.year),
        status: (req.body.status ?? "disponible") as "disponible" | "reservado",
      };

      if (!payload.title || !payload.author || !payload.year) {
        return res
          .status(400)
          .json({ error: "title, author y year son requeridos" });
      }

      const book = repo.create(payload);
      await repo.save(book);

      logger.info(`Libro creado: "${book.title}" por ${book.author}`);

      return res.status(201).json(book);
    } catch (err) {
      logger.error(`Error creando libro: ${(err as Error).message}`);
      return res.status(500).json({ error: "Error creando libro" });
    }
  },

  list: async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Book);
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const q = (req.query.q as string) || "";
    const status = (req.query.status as string) || undefined;
    const sort = (req.query.sort as string) || "id";

    const qb = repo
      .createQueryBuilder("b")
      .where(q ? "(b.title LIKE :q OR b.author LIKE :q)" : "1=1", {
        q: `%${q}%`,
      });

    if (status) qb.andWhere("b.status = :status", { status });

    sort.split(",").forEach((s) => {
      const desc = s.startsWith("-");
      const field = desc ? s.slice(1) : s;
      if (field) qb.addOrderBy(`b.${field}`, desc ? "DESC" : "ASC");
    });

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  },
  get: async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Book);
    const book = await repo.findOne({ where: { id: Number(req.params.id) } });
    if (!book) return res.status(404).json({ error: "Not found" });
    res.json(book);
  },
  update: async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Book);
    const id = Number(req.params.id);
    const exists = await repo.findOne({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Not found" });
    await repo.update({ id }, req.body);
    const updated = await repo.findOne({ where: { id } });
    logger.info(`Libro actualizado (ID: ${id})`);
    res.json(updated);
  },
  remove: async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Book);
    const id = Number(req.params.id);
    const exists = await repo.findOne({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Not found" });
    await repo.delete({ id });
    logger.info(`Libro eliminado (ID: ${id})`);
    res.status(204).send();
  },
};
