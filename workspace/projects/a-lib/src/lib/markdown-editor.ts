import { afterNextRender, Component, effect, ElementRef, HostListener, inject, InjectionToken, input, InputSignal, InputSignalWithTransform, model, signal, untracked, viewChild } from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import { Marked, marked } from "marked";
import DOMPurify from "dompurify";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";


export const MARKED_TOKEN = new InjectionToken<Marked>('MARKED_TOKEN');

export interface Options {
  toolbar: ToolbarOptions;
}

export interface ToolbarOptions {
  headings?: Array<number>;
  emphasis?: {
    bold?: boolean;
    italic?: boolean;
  };
  lists?: {
    ordered?: boolean;
    unordered?: boolean;
  };
  blockquote?: boolean;
  code?: {
    inline?: boolean;
    block?: boolean;
  };
  horizontalRule?: boolean;
  hyperlink?: boolean;
  image?: boolean;
  redo?: boolean;
  undo?: boolean;
  download?: boolean;
}

export const DefaultOptions: Options = {
  toolbar: {
    headings: [1, 2, 3],
    emphasis: {
      bold: true,
      italic: true,
    },
    lists: {
      ordered: true,
      unordered: true,
    },
    blockquote: true,
    code: {
      inline: true,
      block: true,
    },
    horizontalRule: true,
    hyperlink: true,
    image: true,
    redo: true,
    undo: true,
    download: true,
  },
};


@Component({
  selector: 'markdown-editor',
  standalone: true,
  styles: ``,
  template: `
<div class="wrapper">
  <div class="toolbar">
    <div class="left">
      @if (!showPreview()) {
        @for (headline of options().toolbar.headings; track $index) {
          <button
            [title]="'Heading ' + headline"
            [class.active]="focused() && isHeading(headline)"
            (click)="toggleHeading(headline)"
          >
            H{{ headline }}
          </button>
        }

        @if (options().toolbar.emphasis?.bold) {
          <button title="Bold" [class.active]="isBold()" (click)="toggleBold()"><b>B</b></button>
        }

        @if (options().toolbar.emphasis?.italic) {
          <button title="Italic" [class.active]="isItalic()" (click)="toggleItalic()">
            <i>I</i>
          </button>
        }

        @if (options().toolbar.lists?.unordered) {
          <button
            title="Unordered List"
            [class.active]="focused() && isUnorderedList()"
            (click)="toggleUnorderedList()"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.lists?.ordered) {
          <button
            title="Ordered List"
            [class.active]="focused() && isOrderedList()"
            (click)="toggleOrderedList()"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.blockquote) {
          <button
            title="Block Quote"
            [class.active]="focused() && isQuote()"
            (click)="toggleQuote()"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.code?.block) {
          <button
            title="Code Block"
            [class.active]="focused() && isCodeBlock()"
            (click)="toggleCodeBlock()"
          >
            <svg

              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 3v4a1 1 0 0 1-1 1H5m5 4-2 2 2 2m4-4 2 2-2 2m5-12v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.code?.inline) {
          <button
            title="Inline Code"
            [class.active]="focused() && isInlineCode()"
            (click)="toggleInlineCode()"
          >
            <svg

              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.horizontalRule) {
          <button
            title="Horizontal Divider"
            [class.active]="focused() && isDivider()"
            (click)="toggleDivider()"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 12h14" />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                d="M6 9.5h12m-12-2h12m-12-2h12m-12 13h12m-12-2h12m-12-2h12"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.hyperlink) {
          <button title="Hyperlink" [class.active]="focused() && isLink()" (click)="toggleLink()">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.image) {
          <button title="Image" [class.active]="focused() && isImage()" (click)="toggleImage()">
            <svg

              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        }

        @if (options().toolbar.undo) {
          <button title="Undo" [disabled]="!canUndo()" (click)="undo()">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4" />
            </svg>
          </button>
        }

        @if (options().toolbar.redo) {
          <button title="Redo" [disabled]="!canRedo()" (click)="redo()">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 9H8a5 5 0 0 0 0 10h9m4-10-4-4m4 4-4 4" />
            </svg>
          </button>
        }
      }
    </div>

    <div class="right">
      @if (options().toolbar.download) {
        <button (click)="download()" [disabled]="!value().length" title="Download">
          <svg aria-hidden="true" fill="none"
               height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2" />
          </svg>
        </button>
      }

      <button (click)="togglePreview()" class="previewBtn" title="Preview">
        @if (showPreview()) {
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
              clip-rule="evenodd"
            />
          </svg>
        } @else {
          <svg

            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
            />
            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        }
      </button>
    </div>
  </div>

  <div [hidden]="!showPreview()" [innerHTML]="preview()" class="preview"></div>
  <textarea
    #editor
    (click)="cacheSelection(editor)"
    (input)="onInput(editor)"
    (keyup)="cacheSelection(editor)"

    [hidden]="showPreview()"

    (focusin)="toggleFocused()"
    (focusout)="toggleFocused()"
    [disabled]="disabled()"
    [placeholder]="placeholder()"
    [rows]="rows()"
    [value]="value()"
  ></textarea>
</div>
  `,
})
export class MardownEditor implements FormValueControl<string> {

  domSanitizer = inject(DomSanitizer);

  value = model('');
  disabled = input<boolean>(false);

  options = input.required<Options>();
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

  marked: Marked;
  
  constructor() {

    this.marked = inject(MARKED_TOKEN) ?? marked.setOptions({
      gfm: true,
      breaks: true,
    });

    effect(()=>{
      const v = this.value();
      untracked(()=>{
        this.historyIndex.update(i => --i);
        const l = this.value().length;
        this.selStart.set(l);
        this.selEnd.set(l);
        this.caretPos.set(l);
        this.appendHistory(l, l);
      });
    });

    afterNextRender(()=>{
      window.addEventListener('insertSnippet', (e: any)=>{
        const snippet: string = e.detail.snippet;
        this.replaceSelection(snippet, e.detail.moveCaret);
      });
    });
  }


  @HostListener('document:keydown', ['$event']) 
  handleKeyboardEvent(event: KeyboardEvent) {

  }

  private get selection(): string {
    return this.value().slice(this.selStart(), this.selEnd());
  }

  private get lines(): {currentLineIndex: number, lineRanges: {from: number, to: number, content: string}[]} {
    let lineOffset = 0;
    const lineRanges = this.value().split('\n').map((line) => {
      const r =  {
        from: lineOffset,
        to: lineOffset + line.length,
        content: line,
      };
      lineOffset += line.length + 1;
      return r;
    });
    const currentLineIndex = lineRanges.findIndex(lineRange => this.caretPos() >= lineRange.from && this.caretPos() <= lineRange.to);
    return {currentLineIndex, lineRanges: lineRanges};
  }

  private replaceSelection(snippet: string, moveCaret: 'start' | 'end' = 'end') {
    const before = this.value().slice(0, this.selStart());
    const after = this.value().slice(this.selEnd());
    this.value.set(before + snippet + after); 

    switch(moveCaret) {
      case 'start': {
        this.appendHistory(this.caretPos(), this.selStart());
        this.caretPos.set(this.selStart());
        break;
      }
      case 'end': {
        this.appendHistory(this.caretPos(), this.selStart() + snippet.length);
        this.caretPos.set(this.selStart() + snippet.length);
        break;
      }
    }

    setTimeout(()=>{
      this.editorElementRef()?.nativeElement.focus();
      this.editorElementRef()?.nativeElement.setSelectionRange(this.caretPos(), this.caretPos());
      this.cacheSelection(this.editorElementRef()!.nativeElement)
    });
  }

  private isNoneSelected() {
    return this.selStart() === this.selEnd();
  }

  private setSelectionToCurrentLine() {
    const lines = this.lines
    if (lines.currentLineIndex > 0) {
      this.selStart.set(lines.lineRanges[lines.currentLineIndex].from);
      this.selEnd.set(lines.lineRanges[lines.currentLineIndex].to);
    }
  }

  private async updatePreview() {
    const rawHtml = await this.marked.parse(this.value());
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    const safeHtml = this.domSanitizer.bypassSecurityTrustHtml(cleanHtml);
    this.preview.set(safeHtml);
  }

  private appendHistory(caretPosBefore: number, caretPosAfter: number) {
    if (this.value() != this.history()[this.historyIndex()]?.content) {
      this.history.update(h => [
        ...h.slice(0, this.historyIndex() + 1),
        {caretPosBefore, caretPosAfter, content: this.value()},
      ]);
      this.historyIndex.update(i => ++i);
    }

  }


  togglePreview() {
    if (!this.showPreview()) {
      this.updatePreview();
    }
    this.showPreview.update(s => !s);
    if (!this.showPreview()) {
      setTimeout(()=>{
        this.editorElementRef()?.nativeElement.focus();
      });
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

  onInput(editorElementRef: HTMLTextAreaElement) {
    this.value.set(editorElementRef.value);
    if(this.selStart() != this.selEnd()) {
      this.appendHistory(this.caretPos(), this.selStart());
      this.caretPos.set(this.selStart());
    } else {
      this.appendHistory(this.caretPos(), this.selEnd());
      this.caretPos.set(this.selEnd());
    }
  }

  /////////////// todo:

    isHeading(size: number){}
    toggleHeading(size: number){}

    isItalic(){}
    toggleItalic(){}

    isBold(){}
    toggleBold(){}

    isUnorderedList(){}
    toggleUnorderedList(){}

    isOrderedList(){}
    toggleOrderedList(){}

    isQuote(){}
    toggleQuote(){}

    isCodeBlock(){}
    toggleCodeBlock(){}

    isInlineCode(){}
    toggleInlineCode(){}

    isDivider(){}
    toggleDivider(){}

    isLink(){}
    toggleLink(){}

    isImage(){}
    toggleImage(){}

    undo(){}
    canUndo():boolean{return false;}

    redo(){}
    canRedo():boolean{return false}

    download(){}


}

