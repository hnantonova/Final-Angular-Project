import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardItem } from '../../models/cardItemModule';
import { collection } from '../../card-item-collection';
import { CardItemComponent } from '../shared/card-item/card-item.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  cardItemCollection: CardItem[] = collection;

  constructor() {}
  ngOnInit() {}
}
