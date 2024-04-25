import { Ingredient } from './../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [
    {
      name: 'A Test Recipe',
      description: 'This is a test',
      imagePath:
        'https://images.immediate.co.uk/production/volatile/sites/30/2023/09/Prawn-harissa-spaghetti--b3b0fdd.jpg?quality=90&resize=556,505',
      ingredients: [
        {
          name: 'Tomato',
          amount: 1,
        },
        {
          name: 'Apple',
          amount: 5,
        },
        {
          name: 'Flour',
          amount: 1,
        },
      ],
    },
    {
      name: 'Some Burger',
      description: 'Amzingly looking burger',
      imagePath:
        'https://images.services.kitchenstories.io/oR0QlV_BJQq6E3KO86G7GBsNm3c=/3840x0/filters:quality(80)/images.kitchenstories.io/wagtailOriginalImages/R2121_smash_burger_title.jpg',
      ingredients: [
        {
          name: 'Meat',
          amount: 1,
        },
        {
          name: 'Salt',
          amount: 5,
        },
        {
          name: 'Herbs',
          amount: 1,
        },
      ],
    },
  ];

  /**
   *
   */
  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    return this.recipes.push(recipe);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
