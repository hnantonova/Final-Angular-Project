import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardItem } from '../../../models/cardItemModel';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterModule, MatCardModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  @Input() item: CardItem | undefined;
}
