import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { EditorService } from "./editor.service";


@Component({
  selector: 'toolbar-item-download',
  templateUrl: './toolbar-item-download.component.html',
  styleUrl: './toolbar-item-download.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarItemDownloadComponent {

  editorService = inject(EditorService);

  canDownload(): boolean {
    return this.editorService.value().length > 0;
  }

  download() {
    const val = this.editorService.value();
    const blob = new Blob([val], { type: 'text/markdown'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md',
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
