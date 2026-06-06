import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-redo',
  templateUrl: './toolbar-item-redo.component.html',
  styleUrl: './toolbar-item-redo.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarItemRedoComponent {

  editorService = inject(EditorService);

  canRedo(): boolean {
    return this.editorService.historyIndex() < (this.editorService.history().length - 1);
  }

  redo(): void {
    if (this.canRedo()) {
      this.editorService.historyIndex.update(i => ++i);
      
      const his = this.editorService.history()[this.editorService.historyIndex()];

      const val = his.content;
      this.editorService.value.set(val);

      this.editorService.caretPos.set(his.caretPosAfter);

      this.editorService.editorElementRef()?.nativeElement.focus();

      setTimeout(()=>{
        this.editorService.editorElementRef()?.nativeElement.setSelectionRange(
          his.caretPosBefore,
          this.editorService.caretPos(),
        );
      });

    }
  }

}