import { max, min, required, SchemaPathTree } from '@angular/forms/signals';

export type CalculatorForm = {
  distance: number;
  gasolinePrice: number;
  distancePerLiter: number;
  isRoundTrip: boolean;
};

const MIN = 1.1;
const MAX_DISTANCE = 999999;
const MAX_GASOLINE_PRICE = 99;
const MAX_DISTANCE_PER_LITER = 99;

export const calculatorFormSchema = (schemaPath: SchemaPathTree<CalculatorForm>) => {
  required(schemaPath.distance, { message: 'Distância é obrigatória' });
  min(schemaPath.distance, MIN, { message: 'Distância precisa ser maior que 1' });
  max(schemaPath.distance, MAX_DISTANCE, { message: 'Distância precisa ser menor que 1 milhão' });
  required(schemaPath.gasolinePrice, { message: 'Preço do combustível é obrigatório' });
  min(schemaPath.gasolinePrice, MIN, {
    message: 'Preço do combustível precisa ser maior que 1',
  });
  max(schemaPath.gasolinePrice, MAX_GASOLINE_PRICE, {
    message: 'Preço do combustível precisa ser menor que R$ 100,00',
  });
  required(schemaPath.distancePerLiter, { message: 'Distância por litro é obrigatória' });
  min(schemaPath.distancePerLiter, MIN, {
    message: 'Distância por litro precisa ser maior que 1',
  });
  max(schemaPath.distancePerLiter, MAX_DISTANCE_PER_LITER, {
    message: 'Distância por litro precisa ser menor que 100 Km/L',
  });
};
