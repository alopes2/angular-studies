import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.scss',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLInputElement>;
  // @ViewChild('amountInput') amountInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('form') form!: NgForm;

  subscription!: Subscription;
  editMode = false;
  editedItemIndex?: number;
  editedItem?: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (itemId: number) => {
        this.editMode = true;
        this.editedItemIndex = itemId;
        this.editedItem = this.shoppingListService.getIngredient(itemId);

        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddItem(form: NgForm) {
    const name = form.value.name || '';
    const amount = form.value.amount || 0;
    const newIngredient: Ingredient = {
      name: name,
      amount: amount,
    };

    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemIndex!,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }

    this.onReset();
  }

  onReset() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex!);
    this.onReset();
  }
}
