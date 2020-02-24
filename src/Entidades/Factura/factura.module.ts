import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaEntity } from './factura.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { ArtistaService } from '../Artista/artista.service';
import { ArtistaEntity } from '../Artista/artista.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        FacturaEntity,
        ArtistaEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    FacturaController,
  ],
  providers: [
    FacturaService,
    ArtistaService,
  ],
  exports: [
    FacturaService,
    ArtistaService,
  ],
})
export class FacturaModule {
}
