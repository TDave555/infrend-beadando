import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-apartment-create',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './apartment-create.component.html',
  styleUrl: './apartment-create.component.css'
})
export class ApartmentCreateComponent {

}
