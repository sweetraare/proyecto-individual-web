import { BadRequestException, Body, Controller, Get, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { DetalleFacturaService } from './detalleFactura.service';
import { DetalleFacturaEntity } from './detalleFactura.entity';
import { DetalleFacturaCreateDto } from './detalleFactura.create-dto';

@Controller('detallefactura')
export class DetalleFacturaController {
  constructor(
    private readonly _detalleFacturaService: DetalleFacturaService,
  ) {
  }

  @Post()
  async ingresarDetalleFactura(
    @Body() detallefactura: DetalleFacturaEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      console.log(session);
      if (session.usuario.roles.includes('Usuario')) {
        const detallefacturaCreateDto = new DetalleFacturaCreateDto();
        detallefacturaCreateDto.cantidad = detallefactura.cantidad;
        detallefacturaCreateDto.precio = detallefactura.precio;
        detallefacturaCreateDto.subtotal = detallefactura.subtotal;
        const errores = await validate(detallefacturaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            await this._detalleFacturaService.crearDetalleFactura(detallefactura);
            res.send('OK');
          } catch (e) {
            throw new BadRequestException('No se puede ingresar el detallefactura');
          }
        }
      } else {
        res.send('No cuenta con permisos de Usuario');
      }
    }
  }

  @Get()
  buscarFacturas(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<DetalleFacturaEntity[] | undefined> {
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
    return this._detalleFacturaService.buscarDetallesFactura(
      where,
      skip as number,
      take as number,
      order,
    );
  }
}
