import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class ConciertoUpdateDto {

  @IsInt()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @Min(1)
  capacidad: number;

  @IsString()
  @IsNotEmpty()
  tipoMusica: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsInt()
  @Min(0)
  @Max(24)
  horaInicio: number;

  @IsInt()
  @Min(0)
  @Max(24)
  horaFin: number;

  @IsString()
  @IsNotEmpty()
  area: string;
}
