import { afterNextRender, ChangeDetectionStrategy, Component, contentChildren, effect, ElementRef, HostListener, inject, InjectionToken, input, InputSignal, InputSignalWithTransform, model, signal, untracked, viewChild, ViewContainerRef } from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { TemplateSelection } from "../template-selection";
import { EditorService } from "./editor.service";

@Component({
  selector: 'markdown-editor',
  standalone: true,
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './markdown-editor.scss',
  templateUrl: './markdown-editor.html',
  providers: [
    { provide: EditorService, useClass: EditorService },
  ],
})
export class MardownEditor implements FormValueControl<string> {

  domSanitizer = inject(DomSanitizer);
  viewContainerRef = inject(ViewContainerRef);
  templateSelections = contentChildren(TemplateSelection);
  editorService = inject(EditorService);

  toolbarLeft = viewChild('toolbarLeft', {read: ElementRef<HTMLDivElement>});
  toolbarRight = viewChild('toolbarRight', {read: ElementRef<HTMLDivElement>});

  value = model('');
  disabled = input<boolean>(false);

  rows = input<number>(0);
  placeholder = input<string>('Enter Markdown ...');

  editorElementRef = viewChild<ElementRef<HTMLTextAreaElement>>('editor');

  focused = signal(true);

  selStart = signal(0);
  selEnd = signal(0);
  caretPos = signal(0);

  preview = signal<SafeHtml | null>(null);
  showPreview = signal<boolean>(false);

  history = signal<{ caretPosBefore: number; caretPosAfter: number, content: string}[]>([]);
  historyIndex = signal<number>(0);

  
  constructor() {

    this.editorService.init({
      value: this.value,
      editorElementRef: this.editorElementRef,
    });
    this.preview = this.editorService.preview;
    this.focused = this.editorService.focused;


    // logging
    effect(()=>{
      const focused = this.focused();
      untracked(()=>{
        console.log(`[INFO] markdown-editor.ts - focused: ${focused}`); 
      });
    });


    effect(()=>{
      const v = this.value();
      untracked(()=>{
        this.historyIndex.update(i => --i);
        const l = this.value().length;
        this.selStart.set(l);
        this.selEnd.set(l);
        this.caretPos.set(l);
        this.editorService.appendHistory(l, l);
      });
    });

    afterNextRender(()=>{
      window.addEventListener('insertSnippet', (e: any /* CustomEvent<InsertSnippetEvent> */)=>{
        // const snippet: string = e.detail.snippet;
        // this.editorService.replaceSelection(snippet, e.detail.moveCaret);
        setTimeout(()=>{
          this.editorElementRef()?.nativeElement.focus();
          this.editorElementRef()?.nativeElement.setSelectionRange(this.caretPos(), this.caretPos());
          this.cacheSelection(this.editorElementRef()!.nativeElement)
        });
      });
    });

    afterNextRender(()=>{
      // toolbar left
      this.templateSelections().filter(t => t.name() === 'left').forEach(templateSelection => {
        const templateRef = templateSelection.templateRef;
        const embeddedView = this.viewContainerRef.createEmbeddedView(templateRef, {
          // context
          editor: this,
        });
        embeddedView.rootNodes.forEach(node => 
          this.toolbarLeft()?.nativeElement.appendChild(node));
      });

      // toolbar right
      this.templateSelections().filter(t => t.name() === 'right').forEach(templateSelection => {
        const templateRef = templateSelection.templateRef;
        const embeddedView = this.viewContainerRef.createEmbeddedView(templateRef, {
          // context
          editor: this,
        });
        embeddedView.rootNodes.forEach(node => 
          this.toolbarRight()?.nativeElement.appendChild(node));
      });
    });
  }



  @HostListener('document:keydown', ['$event']) 
  handleKeyboardEvent(event: KeyboardEvent) {
    // todo override shortcuts for markdown formatting (e.g. ctrl+b for bold, ctrl+i for italic, etc.)
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.togglePreview();
    }
  }


  togglePreview() {
    if (!this.showPreview()) {
      this.editorService.updatePreview();
    }
    this.showPreview.update(s => !s);
    if (!this.showPreview()) {
      setTimeout(()=>{
        this.editorElementRef()?.nativeElement.focus();
      });
    }
  }

  onClick($event: Event, editor: HTMLTextAreaElement) {
    this.cacheSelection(editor);
  }

  onKeyup($event: KeyboardEvent, editor: HTMLTextAreaElement) {
    if ($event.key === 'Tab') {
      $event.preventDefault();
      this.cacheSelection(editor);
      this.editorService.replaceSelectionThenCursorEnd('\t');
      this.caretPos.update(v => v + 1);
    } else {
      this.cacheSelection(editor);
    }
  }

  cacheSelection(editorElement: HTMLTextAreaElement) {
    switch(editorElement.selectionDirection) {
      case 'forward': {
        this.caretPos.set(editorElement.selectionEnd ?? 0);
        break;
      }
      case 'backward': {
        this.caretPos.set(editorElement.selectionStart ?? 0);
        break;
      }
      default: {
        this.caretPos.set(editorElement.selectionEnd ?? 0);
      }
    }
    this.selStart.set(editorElement.selectionStart ?? 0);
    this.selEnd.set(editorElement.selectionEnd ?? 0);
  }

  toggleFocused() {
    this.focused.update(f => !f);
  }

  onInput(editorElement: HTMLTextAreaElement) {
    const raw = editorElement.value;
    const normalized = this.editorService.normalizeNewlines(raw);

    if (normalized !== raw) {
      const selectionStart = this.editorService.mapSelectionToNormalized(raw, editorElement.selectionStart ?? 0);
      const selectionEnd = this.editorService.mapSelectionToNormalized(raw, editorElement.selectionEnd ?? 0);
      editorElement.value = normalized;
      editorElement.setSelectionRange(selectionStart, selectionEnd);
    }

    this.cacheSelection(editorElement);
    this.value.set(normalized);

    if (this.selStart() !== this.selEnd()) {
      this.editorService.appendHistory(this.caretPos(), this.selStart());
      this.caretPos.set(this.selStart());
    } else {
      this.editorService.appendHistory(this.caretPos(), this.selEnd());
      this.caretPos.set(this.selEnd());
    }
  }

  /////////////// todo:



    isImage(): boolean { return false; }
    toggleImage(): void {}

    undo(): void {}
    canUndo(): boolean { return false; }

    redo(): void {}
    canRedo(): boolean { return false; }

    download(): void {}



}


