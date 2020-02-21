import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioCreateDto } from './usuario.create-dto';
import { UsuarioUpdateDto } from './usuario.update-dto';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
  ) {
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Session() session,
    @Res() res,
  ) {
    let usuarioValidado = await this._usuarioService.validarUsuario(username, password);
    console.log(usuarioValidado);
    if (usuarioValidado.validado) {
      session.usuario = {
        nombre: usuarioValidado.username,
        userId: usuarioValidado.id,
        roles: [usuarioValidado.rol],
      };
      res.send('ok');
    } else {
      res.send('No se encuentra registrado');
    }

    throw new BadRequestException('No envia credenciales');
  }

  @Get('logout')
  logout(
    @Session() session,
    @Req() req,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    return session;
  }

  @Post()
  async ingresarUnUsuario(
    @Body() usuario: UsuarioEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        const usuarioCreateDto = new UsuarioCreateDto();
        usuarioCreateDto.username = usuario.username;
        usuarioCreateDto.password = usuario.password;
        usuarioCreateDto.rol = usuario.rol;
        const errores = await validate(usuarioCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            await this._usuarioService.crearUsuario(usuario);
            res.send('OK');
          } catch (e) {
            throw new BadRequestException('No se puede ingresar el usuario');
          }
        }
      } else {
        res.send('No cuenta con permisos de Administrador');
      }
    }

  }

  @Get(':id')
  buscarUnUsuario(
    @Param('id') id: string,
  ): Promise<UsuarioEntity | undefined> {
    return this._usuarioService.buscarUnUsuario(Number(id));
  }

  @Get()
  buscarUsuarios(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<UsuarioEntity[] | undefined> {
    if (order) {
      try {
        order = JSON.parse(order);
      } catch (e) {
        order = undefined;
      }
    }

    if (where) {
      try {
        where = JSON.parse(where);
      } catch (e) {
        where = undefined;
      }
    }
    return this._usuarioService.buscarUsuarios(
      where,
      skip as number,
      take as number,
      order,
    );
  }

  @Post(':id')
  async actualizarUsuario(
    @Body() usuario: UsuarioEntity,
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        const usuarioUpdateDto = new UsuarioUpdateDto();
        usuarioUpdateDto.username = usuario.username;
        usuarioUpdateDto.password = usuario.password;
        usuarioUpdateDto.rol = usuario.rol;
        usuarioUpdateDto.id = +id;
        const errores = await validate(usuarioUpdateDto);
        if (errores.length > 0) {
          throw new BadRequestException();
        } else {
          await this._usuarioService.actualizarUsuario(+id, usuario);
          res.send('Ok');
        }
      } else {
        res.send('No cuenta con permisos de Administrador');
      }
    }
  }

  @Post(':id')
  async eliminarUsuario(
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      if (session.usuario.roles.includes('Administrador')) {
        try {
          await this._usuarioService.borrarUsuario(+id);
          res.send('Ok');
        } catch (error) {
          throw new BadRequestException();
        }
      } else {
        res.send('No cuenta con permisos de administrador');
      }
    }

  }


}
