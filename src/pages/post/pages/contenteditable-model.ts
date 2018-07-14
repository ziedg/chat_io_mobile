import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';


@Directive({
  selector: '[contenteditableModel]',
  host: {
    '(blur)': 'onBlur()'
  }
})
export class ContenteditableModel implements OnChanges {
  @Input('contenteditableModel') model: any;
  @Output('contenteditableModelChange') update = new EventEmitter();

  private lastViewModel: any;


  constructor(private elRef: ElementRef) {
  }

  ngOnChanges(changes) {
    //if (isPropertyUpdated(changes, this.lastViewModel)) {
      this.lastViewModel = this.model;
      this.refreshView();
    //}
  }

  onBlur() {
    var value = this.elRef.nativeElement.innerHTML
    this.lastViewModel = value
    this.update.emit(value)
  }

  private refreshView() {
    this.elRef.nativeElement.innerHTML = this.model
  }
}
