import { Component } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
})
export class ShoppingListComponent {
  ingredients: Ingredient[] = [
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

  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
}
