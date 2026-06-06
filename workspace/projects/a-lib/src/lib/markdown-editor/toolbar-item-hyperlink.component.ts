import { inject } from "@angular/core";
import { EditorService } from "./editor.service";


export class ToolbarItemHyperlinkComponent {
  editorService = inject(EditorService);

  isLink(): boolean { 
    return /^\[.*]\(.*\)/.test(this.editorService.selection);
  }

  toggleLink(): void {
    if (this.isLink()) {
      this.editorService.replaceSelectionThenCursorEnd(`[${this.editorService.selection}](https://)`);
    } else {
      const match = this.editorService.selection.match(/^\[(.*)]\(.*\)/);
      if (match?.length == 2) {
        this.editorService.replaceSelectionThenCursorEnd(match[1]);
      }
    }
  }
}