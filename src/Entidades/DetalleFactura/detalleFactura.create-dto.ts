import { IsNotEmpty, IsNumber } from 'class-validator';

export class DetalleFacturaCreateDto {

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsNotEmpty()
  @IsNumber()
  subtotal: number;
}
