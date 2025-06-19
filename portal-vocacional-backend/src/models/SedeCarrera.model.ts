import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Sede from "./Sede.model";
import Carrera from "./Carrera.model";

@Table({ tableName: "sede_carrera", timestamps: false })
class SedeCarrera extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Sede)
  @Column(DataType.INTEGER)
  idSede: number;

  @BelongsTo(() => Sede)
  sede: Sede;

  @ForeignKey(() => Carrera)
  @Column(DataType.INTEGER)
  idCarrera: number;

  @BelongsTo(() => Carrera)
  carrera: Carrera;

  @Column({ allowNull: false, type: DataType.STRING })
  jornada: string;

  @Column(DataType.INTEGER)
  arancel: number;

  @Column(DataType.INTEGER)
  cuposPace: number;

  @Column(DataType.INTEGER)
  puntajeCorte: number;

  @Column(DataType.STRING)
  enlace: string;
}

export default SedeCarrera;
