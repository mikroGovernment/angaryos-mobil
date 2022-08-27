import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component(
{
    selector: 'number-element',
    styleUrls: ['./number-element.component.scss'],
    templateUrl: './number-element.component.html'
})
export class NumberElementComponent
{
    @Input() defaultData: string = "";
    @Input() value: string;
    @Input() name: string;
    @Input() class: string;
    @Input() placeholder: string;
    @Input() showFilterTypesSelect: boolean;
    @Input() filterType: string;
    @Input() createForm: boolean = false;

    @Output() changed = new EventEmitter();
    
    ngOnChanges()
    {
        if(this.createForm && this.defaultData.length > 0) this.value = this.defaultData;
    }

    handleChange(event)
    {
        this.changed.emit(event);
    }
}