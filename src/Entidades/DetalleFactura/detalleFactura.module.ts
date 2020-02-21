import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleFacturaEntity } from './detalleFactura.entity';
import { DetalleFacturaController } from './detalleFactura.controller';
import { DetalleFacturaService } from './detalleFactura.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        DetalleFacturaEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    DetalleFacturaController,
  ],
  providers: [
    DetalleFacturaService,
  ],
  exports: [
    DetalleFacturaService,
  ],
})
export class DetalleFacturaModule {
}
