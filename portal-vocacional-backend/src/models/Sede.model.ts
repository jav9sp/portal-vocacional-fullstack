import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Institucion from "./Institucion.model";
import SedeCarrera from "./SedeCarrera.model";

@Table({ tableName: "sede", timestamps: false })
class Sede extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Institucion)
  @Column(DataType.INTEGER)
  idInstitucion: number;

  @BelongsTo(() => Institucion)
  institucion: Institucion;

  @Column({ allowNull: false, type: DataType.STRING })
  region: string;

  @Column({ allowNull: false, type: DataType.STRING })
  comuna: string;

  @Column({ allowNull: false, type: DataType.STRING })
  direccion: string;

  @HasMany(() => SedeCarrera)
  carreras: SedeCarrera[];
}

export default Sede;
