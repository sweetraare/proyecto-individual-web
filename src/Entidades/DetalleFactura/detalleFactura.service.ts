import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { DetalleFacturaEntity } from './detalleFactura.entity';
import { log } from 'util';

@Injectable()
export class DetalleFacturaService {
  constructor(
    @InjectRepository(DetalleFacturaEntity)
    private _repositorioFactura: Repository<DetalleFacturaEntity>,
  ) {
  }

  crearDetalleFactura(detalleFactura: DetalleFacturaEntity) {
    console.log('en el servicio', detalleFactura)
    return this._repositorioFactura.save(detalleFactura);
  }

  buscarDetallesFactura(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'DESC',
    },
  ): Promise<DetalleFacturaEntity[]> {
    return this._repositorioFactura.find(
      {
        where: where,
        skip: skip,
        take: take,
        order: order,
        relations: ['artista'],
      },
    );
  }

  borrarDetalle(id: number): Promise<DeleteResult>{
    return this._repositorioFactura.delete(id);
  }

}
