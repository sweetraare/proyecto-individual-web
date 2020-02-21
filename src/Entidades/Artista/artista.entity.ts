import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConciertoEntity } from '../Concierto/concierto.entity';
import { DetalleFacturaEntity } from '../DetalleFactura/detalleFactura.entity';

@Entity('artista')
export class ArtistaEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'artista_id',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    name: 'artista_nombre',
  })
  nombre: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'artista_representante',
  })
  representante: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'artista_integrantes',
  })
  integrantes: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'artista_nacionalidad',
  })
  nacionalidad: string;

  @Column({
    type: 'float',
    nullable: false,
    precision: 10,
    scale: 2,
    name: 'artista_precio',
  })
  precio: number;


  @OneToMany(
    type => DetalleFacturaEntity,
    detalleFactura => detalleFactura.artista,
  )
  detalles: DetalleFacturaEntity[];

  @ManyToOne(
    type => ConciertoEntity,
    concierto => concierto.artistas,
  )
  concierto: ConciertoEntity | any | number;

}
