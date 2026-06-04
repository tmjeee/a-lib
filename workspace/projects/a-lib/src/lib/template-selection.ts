import { Directive, TemplateRef, input, inject } from '@angular/core';

/**
 * A directive that marks a template (or element) with a name so it can be
 * queried and rendered manually.
 *
 * This is useful in two main scenarios:
 * - Defining multiple named templates inside a component and choosing which one to render at runtime.
 * - Accepting named templates from a parent component via content projection.
 *
 * ## Supported Syntaxes
 *
 * ```html
 * <!-- On ng-template (recommended for pure templates) -->
 * <ng-template templateSelection="header">...</ng-template>
 * <ng-template templateSelection="footer">...</ng-template>
 *
 * <!-- Using structural directive syntax (also supported) -->
 * <div *templateSelection="'sidebar'">Sidebar content</div>
 * ```
 *
 * ## Consumption Example
 *
 * You can query the templates using either `viewChildren()` or `contentChildren()`,
 * depending on your use case:
 *
 * ```ts
 * @Component({...})
 * export class MyComponent {
 *   // Use viewChildren() if the templates are defined inside this component's own template
 *   internalTemplates = viewChildren(TemplateSelection);
 *
 *   // Use contentChildren() if you want to accept named templates from the parent via content projection
 *   projectedTemplates = contentChildren(TemplateSelection);
 *
 *   getTemplate(name: string): TemplateRef<any> | undefined {
 *     return this.internalTemplates()
 *       .find(t => t.name() === name)
 *       ?.templateRef;
 *   }
 * }
 * ```
 *
 * Then in the template:
 * ```html
 * <ng-container *ngTemplateOutlet="getTemplate('header')"></ng-container>
 * ```
 */
@Directive({
  selector: '[templateSelection]',
  standalone: true,
})
export class TemplateSelection {
  /**
   * The name used to identify this template.
   * Can be bound as `templateSelection="myName"` or `[templateSelection]="someVariable"`.
   */
  name = input.required<string>({ alias: 'templateSelection' });

  /**
   * The underlying TemplateRef that can be used with *ngTemplateOutlet or ViewContainerRef.
   */
  readonly templateRef = inject(TemplateRef);
}

