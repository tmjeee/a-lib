import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-heading',
  templateUrl: './toolbar-item-heading.component.html',
  styleUrl: './toolbar-item-heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class ToolbarItemHeadingComponent {

  headings = [1, 2, 3] as const;

  readonly editorService = inject(EditorService);

  constructor() {
  }

  isHeading(_size: number): boolean { 
    const regex = new RegExp(`^#{${_size}}(?!#)`);
    return regex.test(this.editorService.selectionOrCurrentLine)
  }

  toggleHeading(_size: number): void {
    if (this.editorService.isNoneSelected()) {
      this.editorService.setSelectionToCurrentLine()
    }

    const selection = this.editorService.selection;
    if (selection.startsWith('#')) {
      const currentSize = this.editorService.countHashes(selection);
      if (currentSize === _size) {
        this.editorService.replaceSelectionThenCursorStart(this.editorService.unwrap('#'.repeat(_size), ''));
      } else if (_size > currentSize) {
        this.editorService.replaceSelectionThenCursorEnd(this.editorService.wrap('#'.repeat(_size - currentSize), '', false));
      } else { // _size < currentSize
        this.editorService.replaceSelectionThenCursorStart(this.editorService.unwrap('#'.repeat(currentSize - _size), ''));
      }
    } else {
      this.editorService.replaceSelectionThenCursorEnd(this.editorService.wrap('#'.repeat(_size), '', true));
    }
  }
}