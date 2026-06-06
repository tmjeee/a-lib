import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-bold',
  templateUrl: './toolbar-item-bold.component.html',
  styleUrl: './toolbar-item-bold.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class ToolbarItemBoldComponent {

  editorService = inject(EditorService);

  isBold(): boolean { 
    return /^\*{2}.*\*{2}/.test(this.editorService.selection);
  }

  toggleBold(): void {
    if (this.isBold()) {
      this.editorService.replaceSelectionThenCursorEnd(this.editorService.unwrap('**'));
    } else {
      this.editorService.replaceSelectionThenCursorEnd(this.editorService.wrap('**'));
    }
  }
}