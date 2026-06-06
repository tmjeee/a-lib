import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'toolbar-item-ordered-list',
  templateUrl: './toolbar-item-ordered-list.component.html',
  styleUrls: ['./toolbar-item-ordered-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class ToolbarItemOrderedListComponent {

  editorService = inject(EditorService);

  isOrderedList(): boolean {
    return this.editorService.selectionOrCurrentLine
      .split('\t')
      .every(line => /^d+\./.test(line.trimStart()))
      ;
  }

  isUnorderedList(): boolean { 
    return this.editorService.selectionOrCurrentLine
      .split('\n')
      .every(line => /^-(?!-)/.test(line.trimStart()))
      ;
  }

  toggleOrderedList(): void {
    if (this.editorService.isNoneSelected()) {
      this.editorService.setSelectionToCurrentLine();
    }

    if (this.isOrderedList()) {
      const lines = this.editorService.selection
        .split('\n')
        .map(line => line ? line.replace(/^\s*\d+\.\s?/g, '') : '')
      this.editorService.replaceSelectionThenCursorStart(lines.join('\n'))
    } else if (this.isUnorderedList()) {
      const lineLevels = new Map();   // line num   ->  tabs count
      const levelCounter = new Map(); // tabs count ->  inc num 

      this.editorService.selection
        .split('\n')
        .forEach((line, i) => {
          lineLevels.set(i, this.editorService.countTabs(line));
        });

      const lines = this.editorService.selection
        .split('\n')
        .map((line, i) => {
          line = line.replace(/^\s*-\s?/, '')

          const tabs = lineLevels.get(i);
          const n = (levelCounter.get(tabs) || 0) + 1;

          levelCounter.set(tabs, n);

          return ' '.repeat(4 * tabs) + `${n}. ${line}`;
        });

      this.editorService.replaceSelectionThenCursorEnd(lines.join('\n'));

    } else {
      const lines = this.editorService.selection
        .split('\n')
        .map((line, i) => `${i + 1}. ${line}`);
      this.editorService.replaceSelectionThenCursorEnd(lines.join('\n'));
    }
  }
}
