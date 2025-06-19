import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Sede from "./Sede.model";

@Table({ tableName: "institucion", timestamps: false })
class Institucion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  nombre: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  pace: boolean;

  @Column({ type: DataType.ENUM("Universidad", "IP", "CFT"), allowNull: false })
  tipo: "Universidad" | "IP" | "CFT";

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  gratuidad: boolean;

  @HasMany(() => Sede)
  sedes: Sede[];
}

export default Institucion;
