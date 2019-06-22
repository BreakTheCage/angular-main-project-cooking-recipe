import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {
    //Add ingredient method -> Shopping list component
    ingredientChanged = new EventEmitter<Ingredient[]>();
    
    private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
    ];
    constructor() { }

    getIngredients(): Ingredient[]{
        return this.ingredients.slice();
    }
    
    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientChanged.emit(this.getIngredients())
    }
    
}