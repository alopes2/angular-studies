import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  // This closes the menu when you click elsewhere in the DOM
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elementReference.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }

  // This closes the menu only when you click on it
  //   @HostListener('click') toggleOpen() {
  //     this.isOpen = !this.isOpen;
  //   }

  /**
   *
   */
  constructor(private elementReference: ElementRef) {}
}
