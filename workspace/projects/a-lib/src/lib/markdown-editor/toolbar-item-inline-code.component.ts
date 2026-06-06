import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'toolbar-item-inline-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toolbar-item-inline-code.component.html',
  styleUrl: './toolbar-item-inline-code.component.scss',
  imports: [CommonModule],
})
export class ToolbarItemInlineCodeComponent {

  editorService = inject(EditorService);

  isInlineCode(): boolean { return false; }
  toggleInlineCode(): void {}
}