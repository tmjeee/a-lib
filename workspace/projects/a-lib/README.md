
# a-lib

# Installation
```bash
npm install @tmjeee/a-lib
```

# Feat #1: Markdown Editor (Angular)
### install
In `app.config.ts` add a provider
```typescript
  import { MARKED_TOKEN } from '@tmjeee/a-lib';
  import { marked } from 'marked';

  providers: [
    ...
    {provide: MARKED_TOKEN, useValue: marked.setOptions({
      gfm: true,
      breaks: true,
    })}
    ...
  ]
```

component
```typescript
  @Component({
    ...
  })
  export class MyComponent {

    markdownValue = signal('my markdown');

  }
```

template
```html
  <markdown-editor [(value)]="markdownValue">
    <!-- add toolbar item as needed (left side of toolbar) -->
    <toolbar-item-heading *templateSelection="left" /> <!-- add to the left side of toolbar -->
    <toolbar-item-bold *templateSelection="left" />
    <toolbar-item-italic *templateSelection="left" />
    <toolbar-item-code-block *templateSelection="left" />
    <toolbar-item-quote-block *templateSelection="left" />
    <toolbar-item-horizontal-rule *templateSelection="left" />
    <toolbar-item-hyperlink *templateSelection="left" />
    <toolbar-item-image *templateSelection="left" />
    <toolbar-item-inline-code *templateSelection="left" />
    <toolbar-item-ordered-list *templateSelection="left" />
    <toolbar-item-unordered-list *templateSelection="left" />

    <!-- add toolbar item (right side of toolbar) -->
    <toolbar-item-download *templateSelection="right" />
    <toolbar-item-undo *templateSelection="right" />
    <toolbar-item-redo *templateSelection="right" />
  </markdown-editor>
```

### Add custom component to toolbar 
component 
```typescript
  import {EditorService} from '@tmjeee/a-lib';

  @Component({
    ...
  })
  export class MyToolbarItem {
    editorService = inject(EditorService);

    onClick($event: Event) {
      // do whatever you need, eg. open up dialog etc.

      // use editorService to manipulate markdown
      this.editorService.selection;
      this.editorService.currentLine;
      this.editorService.selectionOrCurrentLine;
      this.lines;
      this.replaceSelection(snippet, 'start');
      this.isNoneSelected; // retruns true if there is a selection else false
      this.setSelectionToCurrentLine(); 
      ... etc
    }
  }
```

```html
 <button (click)="onClick($event)">MyToolbarItem</button>
```




# Feat #2: loading-state (Angular)

```typescript
import {createLoadingState} from '@tmjeee/w-lib';

const loadingState = createLoadingState();
loadingState.withLoading('assets', async ()=>{
   // xhr calls, long running calls
   // loadingState.is('asset');  will be true while this function is running else false
});

const isLoading = loadingState.is('assets'); // signal<boolean> - true when loading else false

loadingState.set('assets', false); // explicitly mark 'asset' as false 
```

# Feat #3: TemplateSelection Directive (Angular)

A lightweight directive that marks a template (or element) with a name. This allows you to define multiple named templates and then query + render them manually at runtime.

It is especially useful when you want to let a component support multiple "slots" or conditional template rendering without hardcoding them.

#### Import

```ts
import { TemplateSelection } from '@tmjeee/w-lib';
```

#### Supported Syntax

You can use it in two ways:

```html
<!-- Recommended: on ng-template -->
<ng-template templateSelection="header">Header content</ng-template>
<ng-template templateSelection="footer">Footer content</ng-template>

<!-- Also supported: structural directive syntax -->
<div *templateSelection="'sidebar'">Sidebar content</div>
```

You can also bind the name dynamically:

```html
<ng-template [templateSelection]="templateName">...</ng-template>
```

#### Querying Templates

Use Angular's `viewChildren` or `contentChildren` to collect the templates:

```ts
@Component({...})
export class MyComponent {
  // Use viewChildren when templates are defined inside this component
  templates = viewChildren(TemplateSelection);

  // Use contentChildren when accepting templates via content projection
  // projectedTemplates = contentChildren(TemplateSelection);
}
```

#### Full Example

```ts
import { Component, viewChildren, ViewContainerRef, inject, afterNextRender } from '@angular/core';
import { TemplateSelection } from '@tmjeee/w-lib';

@Component({
  selector: 'my-component',
  standalone: true,
  imports: [TemplateSelection],
  template: `
    <ng-template templateSelection="header">
      <h1>My Header</h1>
    </ng-template>

    <div *templateSelection="'content'">
      Main content here
    </div>
  `
})
export class MyComponent {
  private vcr = inject(ViewContainerRef);
  templates = viewChildren(TemplateSelection);

  constructor() {
    afterNextRender(() => {
      const headerTpl = this.templates()
        .find(t => t.name() === 'header')
        ?.templateRef;

      if (headerTpl) {
        this.vcr.createEmbeddedView(headerTpl);
      }
    });
  }

  getTemplate(name: string) {
    return this.templates().find(t => t.name() === name)?.templateRef;
  }
}
```

You can then use the retrieved `TemplateRef` with `*ngTemplateOutlet` or `ViewContainerRef.createEmbeddedView()`.

#### Notes

- The directive is **standalone**.
- Use `viewChildren(TemplateSelection)` for templates defined inside the component.
- Use `contentChildren(TemplateSelection)` when the templates are provided by the parent via content projection.

