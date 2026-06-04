/**
 * Tests for TemplateSelection directive.
 *
 * These use Angular's TestBed + Vitest via the @angular/build:unit-test builder.
 * This provides sufficient setup (init-testbed, jsdom-like environment via the builder)
 * to test directives and components that rely on Angular decorators, signals, etc.
 *
 * Note: For more advanced DOM testing or complex component harnesses, you may
 * still benefit from additional tools like @analogjs/vitest-angular or @testing-library/angular.
 */

import { Component, TemplateRef, viewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateSelection } from './template-selection';

@Component({
  standalone: true,
  imports: [TemplateSelection],
  template: `
    <ng-template templateSelection="header">Header</ng-template>
    <div *templateSelection="'sidebar'">Sidebar</div>
    <ng-template [templateSelection]="dynamicName">Dynamic</ng-template>
    <ng-template templateSelection="footer">Footer</ng-template>
  `,
})
class TestHostComponent {
  dynamicName = 'dynamic';
  templates = viewChildren(TemplateSelection);
}

describe('TemplateSelection (requires Angular test setup)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should query multiple TemplateSelection instances', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.templates().length).toBe(4);
  });

  it('should return correct name() values', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const names = fixture.componentInstance.templates().map((t) => t.name());
    expect(names).toEqual(['header', 'sidebar', 'dynamic', 'footer']);
  });

  it('should expose a valid TemplateRef', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const refs = fixture.componentInstance.templates().map((t) => t.templateRef);
    refs.forEach((ref) => expect(ref).toBeInstanceOf(TemplateRef));
  });

  it('should support both ng-template and structural directive syntax', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const templates = fixture.componentInstance.templates();
    expect(templates.find((t) => t.name() === 'header')).toBeDefined();
    expect(templates.find((t) => t.name() === 'sidebar')).toBeDefined();
  });
});
