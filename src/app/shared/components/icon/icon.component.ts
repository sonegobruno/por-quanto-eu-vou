import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type Icon = 'calculate' | 'local_gas_station' | 'dark_mode' | 'light_mode';

@Component({
  selector: 'pqev-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  public readonly icon = input.required<Icon>();
}
