import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'toolbar-item-code-block',
  templateUrl: './toolbar-item-code-block.component.html',
  styleUrls: ['./toolbar-item-code-block.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ToolbarItemCodeBlockComponent {

  editorService = inject(EditorService);

  isCodeBlock(): boolean {
    return  /`{3}\w*\n.*\n`{3}/.test(this.editorService.selection);
  }

  toggleCodeBlock(): void {
    if (!this.isCodeBlock()) {
      this.editorService.replaceSelectionThenCursorEnd('```ts\n'+this.editorService.selection+'\n```');
    } else {
      const match = this.editorService.selection.match(/`{3}\w*\n(.*)\n`{3}/);
      if (match?.length == 2) {
        this.editorService.replaceSelectionThenCursorEnd(match[1]);
      }
    }
  }
}