import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private storageUrl =
    'https://angular-recipe-book-ad2eb.firebaseio.com/recipes.json';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    // return this.http.put(this.storageUrl, recipes);
    return this.http
      .put(this.storageUrl, recipes)
      .subscribe((result) => console.log('Recipes saved'));
  }

  fetchRecipes() {
    const user = this.authService.user.getValue();
    if (user != null)
      return this.http.get<Recipe[]>(this.storageUrl).pipe(
        map((recipes) => {
          return recipes.map((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          }));
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
