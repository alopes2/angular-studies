import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    {
      name: 'Tomato',
      amount: 1,
    },
    {
      name: 'Apple',
      amount: 5,
    },
    {
      name: 'Cola',
      amount: 3,
    },
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);

    this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);

    this.ingredientsChanged.next(this.getIngredients());
  }

  updateIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;

    this.ingredientsChanged.next(this.getIngredients());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);

    this.ingredientsChanged.next(this.getIngredients());
  }
}
