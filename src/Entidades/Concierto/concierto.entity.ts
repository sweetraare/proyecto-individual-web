import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistaEntity } from '../Artista/artista.entity';

@Entity('concierto')
export class ConciertoEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'concierto_id',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'concierto_nombre',
    unique: true,
  })
  nombre: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'concierto_capacidad',
  })
  capacidad: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'concierto_tipo_musica',
  })
  tipoMusica: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'concierto_ciudad',
  })
  ciudad: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'concierto_hora_inicio',
  })
  horaInicio: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'concierto_hora_fin',
    unique: true,
  })
  horaFin: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'concierto_area',
  })
  area: number;


  @OneToMany(
    type => ArtistaEntity,
    artista => artista.concierto,
  )
  artistas: ArtistaEntity[];
}
