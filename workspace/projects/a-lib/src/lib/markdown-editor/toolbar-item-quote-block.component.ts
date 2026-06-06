import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-quote-block',
  templateUrl: './toolbar-item-quote-block.component.html',
  styleUrl: './toolbar-item-quote-block.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ToolbarItemQuoteBlockComponent {

  editorService = inject(EditorService);

  isQuote(): boolean { 
    return /^>\s?/.test(this.editorService.selectionOrCurrentLine);
  }

  toggleQuote(): void {
    if (this.editorService.isNoneSelected()) {
      this.editorService.setSelectionToCurrentLine();
    }

    if (this.isQuote()) {
      this.editorService.replaceSelectionThenCursorStart(
        this.editorService.selection.replace(/>\s?/, '')
      );
    } else {
      this.editorService.replaceSelectionThenCursorEnd(
        this.editorService.wrap('> ', '')
      );
    }
  }
}  