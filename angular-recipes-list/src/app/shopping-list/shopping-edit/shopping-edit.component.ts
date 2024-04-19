import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.scss',
})
export class ShoppingEditComponent {
  @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('amountInput') amountInputRef?: ElementRef<HTMLInputElement>;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();

  onAddItem(event: SubmitEvent) {
    event.preventDefault();
    const name = this.nameInputRef?.nativeElement.value || '';
    const amount = this.amountInputRef?.nativeElement.valueAsNumber || 0;
    const newIngredient: Ingredient = {
      name: name,
      amount: amount,
    };
    this.ingredientAdded.emit(newIngredient);
  }
}
