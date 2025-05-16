import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit,OnDestroy {
  public formControl: FormControl = new FormControl()

  ngOnInit(): void {
    this.formControl = new FormControl('')
  }

  ngOnDestroy(): void {

  }
}
