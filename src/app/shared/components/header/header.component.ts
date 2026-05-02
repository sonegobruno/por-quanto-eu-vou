import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@app/shared/services/theme/theme.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'pqev-header',
  imports: [MatButtonModule, IconComponent, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'p-4',
  },
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
}
