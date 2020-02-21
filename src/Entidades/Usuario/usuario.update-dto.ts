import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UsuarioUpdateDto {

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  rol: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  id: number;
}
