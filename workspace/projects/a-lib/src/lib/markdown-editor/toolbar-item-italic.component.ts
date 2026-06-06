import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-italic',
  templateUrl: './toolbar-item-italic.component.html',
  styleUrl: './toolbar-item-italic.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class ToolbarItemItalicComponent {

  editorService = inject(EditorService);

  isItalic(): boolean { 
    const isBold = /^\*{2}.*\*{2}/.test(this.editorService.selection);
    return (!isBold && /^\*.*\*/.test(this.editorService.selection));
  }

  toggleItalic(): void {
    if (this.isItalic()) {
      this.editorService.replaceSelectionThenCursorEnd(this.editorService.unwrap('*'));
    } else {
      this.editorService.replaceSelectionThenCursorEnd(this.editorService.wrap('*'));
    }
  }
}