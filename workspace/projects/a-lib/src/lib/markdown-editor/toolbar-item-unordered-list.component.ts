import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'toolbar-item-unordered-list',
  templateUrl: './toolbar-item-unordered-list.component.html',
  styleUrls: ['./toolbar-item-unordered-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class ToolbarItemUnorderedListComponent {

  editorService = inject(EditorService);

  isUnorderedList(): boolean { 
    return this.editorService.selectionOrCurrentLine
      .split('\n')
      .every(line => /^-(?!-)/.test(line.trimStart()))
      ;
  }

  isOrderedList(): boolean {
    return this.editorService.selectionOrCurrentLine
      .split('\t')
      .every(line => /^d+\./.test(line.trimStart()))
      ;
  }

  toggleUnorderedList(): void {
    if (this.editorService.isNoneSelected()) {
      this.editorService.setSelectionToCurrentLine();
    }

    if (this.isUnorderedList()) {
      const lines = this.editorService.selection
        .split('\n')
        .map(line => line ? line.replace(/^\s*-\s?/g, '') : '')
      this.editorService.replaceSelectionThenCursorStart(lines.join('\n'));
    } else if (this.isOrderedList()) {
      const lines = this.editorService.selection
        .split('\n')
        .map(line => {
          const tabs = this.editorService.countTabs(line);
          return line.replace(/^\s*\d+/, ' '.repeat(4 * tabs) + '- ');
        });
      this.editorService.replaceSelectionThenCursorEnd(lines.join('\n'));
    } else {
      const lines = this.editorService.selection
        .split('\n')
        .map(line => line ? `- ${line}` : `- `);
      this.editorService.replaceSelectionThenCursorEnd(lines.join('\n'));
    }
  }

}

