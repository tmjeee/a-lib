import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-undo',
  templateUrl: './toolbar-item-undo.component.html',
  styleUrl: './toolbar-item-undo.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarItemUndoComponent {

  editorService = inject(EditorService);

  canUndo(): boolean {
    return this.editorService.historyIndex() > 0;
  }

  undo(): void {
    if (this.canUndo()) {
      const his = this.editorService.history()[this.editorService.historyIndex() - 1];
      const val = his.content;
      this.editorService.value.set(val);

      const selStart = his.caretPosAfter;
      this.editorService.selStart.set(selStart);

      const selEnd = his.caretPosBefore;
      this.editorService.selEnd.set(selEnd);

      this.editorService.historyIndex.update(i => --i);

      this.editorService.editorElementRef()?.nativeElement.focus();

      setTimeout(()=>{
        this.editorService.editorElementRef()?.nativeElement.setSelectionRange(
          this.editorService.caretPos(),
          selEnd,
        )
      });
    }
  }
}