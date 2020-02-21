import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConciertoEntity } from './concierto.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ConciertoService {
  constructor(
    @InjectRepository(ConciertoEntity)
    private _repositorioConcierto: Repository<ConciertoEntity>,
  ) {
  }

  buscarUnConciero(id: number): Promise<ConciertoEntity | undefined> {
    return this._repositorioConcierto.findOne(id);
  }

  crearConcierto(concierto: ConciertoEntity) {
    return this._repositorioConcierto.save(concierto);
  }

  borrarConcierto(id: number): Promise<DeleteResult> {
    return this._repositorioConcierto.delete(id);
  }

  actualizarConcierto(id: number, concierto: ConciertoEntity): Promise<ConciertoEntity> {
    concierto.id = id;
    return this._repositorioConcierto.save(concierto);
  }

  buscarConciertos(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      nombre: 'DESC',
    },
  ): Promise<ConciertoEntity[]> {
    return this._repositorioConcierto.find(
      {
        where: where,
        skip: skip,
        take: take,
        order: order,
      },
    );
  }
}
