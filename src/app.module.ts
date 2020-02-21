import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConciertoEntity } from './Entidades/Concierto/concierto.entity';
import { ArtistaEntity } from './Entidades/Artista/artista.entity';
import { FacturaEntity } from './Entidades/Factura/factura.entity';
import { DetalleFacturaEntity } from './Entidades/DetalleFactura/detalleFactura.entity';
import { UsuarioEntity } from './Entidades/Usuario/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConciertoModule } from './Entidades/Concierto/concierto.module';
import { ArtistaModule } from './Entidades/Artista/artista.module';
import { FacturaModule } from './Entidades/Factura/factura.module';
import { DetalleFacturaModule } from './Entidades/DetalleFactura/detalleFactura.module';
import { UsuarioModule } from './Entidades/Usuario/usuario.module';

@Module({
  imports: [
    ConciertoModule,
    ArtistaModule,
    FacturaModule,
    DetalleFacturaModule,
    UsuarioModule,
    TypeOrmModule.forRoot(
      {
        name: 'default',
        type: 'mysql',
        host: '127.0.0.1',
        port: 32769,
        username: 'root',
        password: 'root',
        database: 'conciertos',
        dropSchema: false,
        entities: [
          ConciertoEntity,
          ArtistaEntity,
          FacturaEntity,
          DetalleFacturaEntity,
          UsuarioEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
