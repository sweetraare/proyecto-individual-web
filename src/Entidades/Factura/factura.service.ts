import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FacturaEntity } from './factura.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(FacturaEntity)
    private _repositorioFactura: Repository<FacturaEntity>,
  ) {
  }

  buscarUnaFactura(id: number): Promise<FacturaEntity | undefined> {
    return this._repositorioFactura.findOne(id,
      {
        relations: ['detalles', 'detalles.pareja'],
      },
    );
  }

  crearFactura(factura: FacturaEntity) {
    return this._repositorioFactura.save(factura);
  }

  borrarFactura(id: number): Promise<DeleteResult> {
    return this._repositorioFactura.delete(id);
  }

  actualizarFactura(id: number, factura: FacturaEntity): Promise<FacturaEntity> {
    factura.id = id;
    return this._repositorioFactura.save(factura);
  }

  buscarFacturas(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      fecha: 'DESC',
    },
  ): Promise<FacturaEntity[]> {
    return this._repositorioFactura.find(
      {
        where: where,
        skip: skip,
        take: take,
        order: order,
      },
    );
  }
}
