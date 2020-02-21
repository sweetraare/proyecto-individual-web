import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistaEntity } from './artista.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ArtistaService {
  constructor(
    @InjectRepository(ArtistaEntity)
    private _repositorioArtista: Repository<ArtistaEntity>,
  ) {
  }

  buscarUnArtista(id: number): Promise<ArtistaEntity | undefined> {
    return this._repositorioArtista.findOne(id, {
      relations: ['concierto'],
    });
  }

  crearArtista(artista: ArtistaEntity) {
    return this._repositorioArtista.save(artista);
  }

  borrarArtista(id: number): Promise<DeleteResult> {
    return this._repositorioArtista.delete(id);
  }

  actualizarArtista(id: number, artista: ArtistaEntity): Promise<ArtistaEntity> {
    artista.id = id;
    return this._repositorioArtista.save(artista);
  }

  buscarArtistas(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      nombre: 'DESC',
    },
  ): Promise<ArtistaEntity[]> {
    return this._repositorioArtista.find(
      {
        where: where,
        skip: skip,
        take: take,
        order: order,
        relations: ['concierto'],
      },
    );
  }
}
