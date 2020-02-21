import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import { validate } from 'class-validator';
import { FacturaService } from './factura.service';
import { FacturaEntity } from './factura.entity';
import { FacturaCreateDto } from './factura.create-dto';

@Controller('factura')
export class FacturaController {
  constructor(
    private readonly _facturaService: FacturaService,
  ) {
  }

  @Post()
  async ingresarFactura(
    @Body() factura: FacturaEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    if (session) {
      console.log(session);
      if (session.usuario.roles.includes('Usuario')) {
        const facturaCreateDto = new FacturaCreateDto();
        facturaCreateDto.fecha = factura.fecha;
        facturaCreateDto.total = factura.total;
        facturaCreateDto.direccion = factura.direccion;
        const errores = await validate(facturaCreateDto);
        if (errores.length > 0) {
          throw new BadRequestException(errores);
        } else {
          try {
            await this._facturaService.crearFactura(factura);
            res.send('OK');
          } catch (e) {
            throw new BadRequestException('No se puede ingresar la factura');
          }
        }
      } else {
        res.send('No cuenta con permisos de Usuario');
      }
    }
  }

  @Get(':id')
  buscarUnaFactura(
    @Param('id') id: string,
  ): Promise<FacturaEntity | undefined> {
    return this._facturaService.buscarUnaFactura(Number(id));
  }

  @Get()
  buscarFacturas(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<FacturaEntity[] | undefined> {
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
    return this._facturaService.buscarFacturas(
      where,
      skip as number,
      take as number,
      order,
    );
  }
}
