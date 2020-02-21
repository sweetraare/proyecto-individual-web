import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioValidado } from './usuarioValidado';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private _repositorioUsuario: Repository<UsuarioEntity>,
  ) {
  }

  buscarUnUsuario(id: number): Promise<UsuarioEntity | undefined> {
    return this._repositorioUsuario.findOne(id);
  }

  crearUsuario(usuario: UsuarioEntity) {
    return this._repositorioUsuario.save(usuario);
  }

  borrarUsuario(id: number): Promise<DeleteResult> {
    return this._repositorioUsuario.delete(id);
  }

  actualizarUsuario(id: number, usuario: UsuarioEntity): Promise<UsuarioEntity> {
    usuario.id = id;
    return this._repositorioUsuario.save(usuario);
  }

  async validarUsuario(username: String, password: String): Promise<UsuarioValidado> {
    let usuario: UsuarioEntity;
    let usuarioValidado = new UsuarioValidado();
    try {
      usuario = await this._repositorioUsuario.findOne({
        where: { 'username': username },
      });
      console.log(usuario.password);
      console.log(password);
      if (password === usuario.password) {
        console.log('ver usuario');
        console.log(usuarioValidado);
        usuarioValidado.id = usuario.id;
        usuarioValidado.username = usuario.username;
        usuarioValidado.rol = usuario.rol;
        usuarioValidado.validado = true;

        return usuarioValidado;
      }
    } catch (e) {
      usuarioValidado.validado = false;
      return usuarioValidado;
    }
    usuarioValidado.validado = false;
    return usuarioValidado;
  }

  buscarUsuarios(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      username: 'DESC',
    },
  ): Promise<UsuarioEntity[]> {
    return this._repositorioUsuario.find(
      {
        where: where,
        skip: skip,
        take: take,
        order: order,
      },
    );
  }
}
