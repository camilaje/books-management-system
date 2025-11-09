import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "Books" })
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "nvarchar", length: 255 })
  title!: string;

  @Column({ type: "nvarchar", length: 255 })
  author!: string;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "varchar", default: "disponible" })
  status!: "disponible" | "reservado";
}
