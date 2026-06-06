import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";
import { CommonModule } from "@angular/common";



@Component({
  selector: 'toolbar-item-horizontal-rule',
  templateUrl: './toolbar-item-horizontal-rule.component.html',
  styleUrl: './toolbar-item-horizontal-rule.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ToolbarItemHorizontalRuleComponent {

  editorService = inject(EditorService);

  isDivider(): boolean { 
    return /^---$/.test(this.editorService.selection);
  }

  toggleDivider(): void {
    if (this.isDivider()) {
      this.editorService.replaceSelectionThenCursorEnd('');
    } else {
      this.editorService.replaceSelectionThenCursorEnd(
        this.editorService.wrap('\n---', '\n\n')
      );
    }
  }

}
