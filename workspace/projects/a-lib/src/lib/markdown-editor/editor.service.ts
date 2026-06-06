import { ElementRef, inject, Injectable, InjectionToken, ModelSignal, Signal, signal, ViewContainerRef } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { marked } from "marked";
import DOMPurify from 'dompurify';

export const MARKED_TOKEN = new InjectionToken<typeof marked>('MARKED_TOKEN');

export interface InsertSnippetEvent {
  snippet: string;
  moveCaret: 'start' | 'end';
}

export interface LinesContext {
  currentLineIndex: number, 
  lineRanges: {from: number, to: number, content: string}[],
}


@Injectable()
export class EditorService {

  domSanitizer = inject(DomSanitizer);
  viewContainerRef = inject(ViewContainerRef);

  selStart = signal(0);     // start of selection, if none then caret position
  selEnd = signal(0);       // end of selection, if none then caret position
  caretPos = signal(0);     // caret position

  history = signal<{ caretPosBefore: number; caretPosAfter: number, content: string}[]>([]);
  historyIndex = signal<number>(0);

  marked: typeof marked;

  value!: ModelSignal<string>;
  preview = signal<SafeHtml | null>(null);
  focused = signal(true);

  editorElementRef!: Signal<ElementRef<HTMLTextAreaElement> | undefined>;

  constructor() {
    // this.marked = inject(MARKED_TOKEN) ?? marked.setOptions({
    //   gfm: true,
    //   breaks: true,
    // });
    this.marked = marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }

  init(opts: {
    value: ModelSignal<string>,
    editorElementRef: Signal<ElementRef<HTMLTextAreaElement> | undefined>,
  }) {
    this.value = opts.value;
    this.editorElementRef = opts.editorElementRef;
  }

  /////////////////////// private  

  /**
   * Get selection in text value based on selStart and selEnd
   */
  get selection(): string {
    return this.value().slice(this.selStart(), this.selEnd());
  }

  /**
   * get current line or '' if none
   */
  get currentLine(): string {
    const lines = this.lines;
    if (lines.currentLineIndex >= 0) {
      return (
        this.value().slice(
          lines.lineRanges[lines.currentLineIndex].from,
          lines.lineRanges[lines.currentLineIndex].to,
        ) || ''
      );
    }
    return '';
  }

  /**
   * return selection (if there is one) else current line or '' if none
   */
  get selectionOrCurrentLine(): string {
    if (this.isNoneSelected()) {
        return this.currentLine;
    }
    return this.selection;
  }


  /**
   * Return LinesContext
   *  - current line array index
   *  - all lines as array (their content and start and end position)
   */
  get lines(): LinesContext {
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
    const currentLineIndex = lineRanges.findIndex(
      lineRange => this.caretPos() >= lineRange.from && this.caretPos() <= lineRange.to);
    return {currentLineIndex, lineRanges: lineRanges};
  }

  /**
   * Put snippet in between selStart() and selEnd() and move carent to 
   * 'start' (selStart() position) or 'end' (selEnd() position)
   * 
   * @param snippet 
   * @param moveCaret 
   */
  replaceSelection(snippet: string, moveCaret: 'start' | 'end' = 'end') {
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

  }

  /**
   * Returns true if there is a selection else false
   * 
   * @returns boolean
   */
  isNoneSelected(): boolean {
    return this.selStart() === this.selEnd();
  }

  /**
   * set selection (selStart() and selEnd()) to the whole line 
   * of this caretPos()
   * 
   * @returns void
   */
  setSelectionToCurrentLine() {
    const lines = this.lines;
    if (lines.currentLineIndex < 0) {
      return;
    }
    this.selStart.set(lines.lineRanges[lines.currentLineIndex].from);
    this.selEnd.set(lines.lineRanges[lines.currentLineIndex].to);
  }

  normalizeNewlines(text: string): string {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  /** Maps a caret index in raw textarea text to the index after CRLF normalization. */
  mapSelectionToNormalized(text: string, position: number): number {
    let removed = 0;
    let i = 0;
    while (i < position && i < text.length) {
      if (text[i] === '\r' && text[i + 1] === '\n') {
        removed++;
        i += 2;
      } else {
        i += 1;
      }
    }
    return position - removed;
  }

  async updatePreview() {
    const rawHtml = await this.marked.parse(this.value());
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    const safeHtml = this.domSanitizer.bypassSecurityTrustHtml(cleanHtml);
    this.preview.set(safeHtml);
  }

  /**
   * create a history entry for redo / undo
   * 
   * @param caretPosBefore 
   * @param caretPosAfter 
   */
  appendHistory(caretPosBefore: number, caretPosAfter: number) {
    if (this.value() != this.history()[this.historyIndex()]?.content) {
      this.history.update(h => [
        ...h.slice(0, this.historyIndex() + 1),
        {caretPosBefore, caretPosAfter, content: this.value()},
      ]);
      this.historyIndex.update(i => ++i);
    }
  }


  //// utils


  /**
   * wrap current selection with `before` prefix  and `after` suffix.
   * 
   * @param before 
   * @param after 
   * @param space 
   * @returns 
   */
  wrap(before: string, after: string = before, space: boolean = false): string {
    if (space) {
      return `${before} ${this.selection}${after}`;
    }
    return `${before}${this.selection}${after}`;
  }

  /**
   * Unwrap current selection with `before` prefix and `after` suffix
   * 
   * @param before 
   * @param after 
   * @returns 
   */
  unwrap(before: string, after = before): string {
    const selection = this.selection;
    let from = before.length;

    if (selection.at(from) == ' ') {
      from++;
    }

    return selection.slice(from, selection.length - after.length);
  }

  /**
   * replace current selection with `snippet` and move cursor to the start of selection. 
   * Dispath 'insertSnippet' event (InsertSnippetEvent)
   *  
   * @param snippet 
   */
  replaceSelectionThenCursorStart(snippet: string) {
    const event  = new CustomEvent<InsertSnippetEvent>('insertSnippet', {detail: {snippet, moveCaret: 'start'}})
    this.replaceSelection(snippet, 'start');
    window.dispatchEvent(event);
  }

  /**
   * replace current seelection with `snippet` and move cursor to the end of selection.
   * Dispath 'insertSnippet' event (InsertSnippetEvent)
   * 
   * @param snippet 
   */
  replaceSelectionThenCursorEnd(snippet: string) {
    const event  = new CustomEvent<InsertSnippetEvent>('insertSnippet', {detail: {snippet, moveCaret: 'end'}})
    this.replaceSelection(snippet, 'end');
    window.dispatchEvent(event);
  }

  /**
   * count tabs of the given string
   * 
   * @param str 
   * @returns 
   */
  countTabs(str: string) : number {
    return str.split(/\S/)[0].length;
  }

  /**
   * count hashes of the given string
   * 
   * @param str 
   * @returns 
   */
  countHashes(str: string) : number {
    return str.split(/[^#]/)[0].length;
  }

}

