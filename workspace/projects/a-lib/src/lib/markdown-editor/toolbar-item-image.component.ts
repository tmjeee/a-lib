import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'toolbar-item-image',
  templateUrl: './toolbar-item-image.component.html',
  styleUrls: ['./toolbar-item-image.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ToolbarItemImageComponent {
  editorService = inject(EditorService);

  isImage(): boolean {
    return /^!\[.*]\(.*\)/.test(this.editorService.selection);
  }

  toggleImage(): void {
    if (!this.isImage()) {
      this.editorService.replaceSelectionThenCursorEnd(`![${this.editorService.selection}](https://)`);
    } else {
      const match = this.editorService.selection.match(/^!\[(.*)]\(.*\)/);
      if (match?.length == 2) {
        this.editorService.replaceSelectionThenCursorEnd(match[1]);
      }
    }
  }

}

