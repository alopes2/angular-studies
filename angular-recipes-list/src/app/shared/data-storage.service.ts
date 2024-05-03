import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs';
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
    // return this.authService.user.pipe(
    //   take(1), // Take is for unsubscribing from the previous subscription
    //   exhaustMap((user) =>
    //     this.http.get<Recipe[]>(this.storageUrl, {
    //       params: new HttpParams().set('auth', user?.token || ''),
    //     })
    //   ),
    //   map((recipes) => {
    //     return recipes.map((recipe) => ({
    //       ...recipe,
    //       ingredients: recipe.ingredients ? recipe.ingredients : [],
    //     }));
    //   }),
    //   tap((recipes) => {
    //     this.recipeService.setRecipes(recipes);
    //   })
    // );

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
