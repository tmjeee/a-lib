import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DefaultOptions, MardownEditor, Options, ToolbarItemHeadingComponent, TemplateSelection } from '@tmjeee/a-lib';

@Component({
  selector: 'demo-page',
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MardownEditor,
    TemplateSelection,
    ToolbarItemHeadingComponent,
],
})
export class DemoPageComponent {
  readonly editorOptions: Options = DefaultOptions;
  readonly markdown = signal(
    '# Hello from demo\n\nTry the **markdown editor** from `@tmjeee/a-lib`.',
  );

  updateMarkdown(value: string): void {
    this.markdown.set(value);
  }
}