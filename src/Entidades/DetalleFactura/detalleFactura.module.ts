import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleFacturaEntity } from './detalleFactura.entity';
import { DetalleFacturaController } from './detalleFactura.controller';
import { DetalleFacturaService } from './detalleFactura.service';
import { FacturaEntity } from '../Factura/factura.entity';
import { ArtistaEntity } from '../Artista/artista.entity';
import { ArtistaService } from '../Artista/artista.service';
import { FacturaService } from '../Factura/factura.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        DetalleFacturaEntity,
        FacturaEntity,
        ArtistaEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    DetalleFacturaController,
  ],
  providers: [
    DetalleFacturaService,
    ArtistaService,
    FacturaService,
  ],
  exports: [
    DetalleFacturaService,
    ArtistaService,
    FacturaService,
  ],
})
export class DetalleFacturaModule {
}
