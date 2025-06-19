import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import SedeCarrera from "./SedeCarrera.model";

@Table({ tableName: "carrera", timestamps: false })
class Carrera extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ allowNull: false, type: DataType.STRING })
  nombre: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  duracion: number;

  @Column({ allowNull: false, type: DataType.STRING })
  area: string;

  @Column(DataType.STRING)
  subArea: string;

  @Column(DataType.JSON)
  ponderaciones: {
    ranking: number;
    nem: number;
    mat1: number;
    compLectora: number;
    mat2?: number;
    ciencias?: number;
    historia?: number;
  };

  @HasMany(() => SedeCarrera)
  sedeCarreras: SedeCarrera[];
}

export default Carrera;
