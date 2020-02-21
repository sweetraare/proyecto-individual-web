import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaEntity } from './factura.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        FacturaEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    FacturaController,
  ],
  providers: [
    FacturaService,
  ],
  exports: [
    FacturaService,
  ],
})
export class FacturaModule {
}
