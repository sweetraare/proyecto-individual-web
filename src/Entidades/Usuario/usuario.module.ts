import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        UsuarioEntity,
      ],
      'default',
    ),
  ],
  controllers: [
    UsuarioController,
  ],
  providers: [
    UsuarioService,
  ],
  exports: [
    UsuarioService,
  ],
})
export class UsuarioModule {
}
