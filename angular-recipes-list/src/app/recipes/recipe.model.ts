import { Ingredient } from '../shared/ingredient.model';

export type Recipe = {
  name: string;
  description: string;
  imagePath: string;
  ingredients: Ingredient[];
};
