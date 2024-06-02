// theme.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme: string = '';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme);
  }

  updateTheme(theme: 'dark' | 'light') {
    this.setColorTheme(theme);
    const previousColorTheme = (theme === 'dark' ? 'light' : 'dark');
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
  }

  isDarkMode() {
    return this.colorTheme === 'dark';
  }

  private setColorTheme(theme: string) {
    this.colorTheme = theme;
    localStorage.setItem('odb-color-theme', theme);
  }

  private getColorTheme() {
    if (localStorage.getItem('odb-color-theme')) {
      this.colorTheme = localStorage.getItem('odb-color-theme')!;
    } else {
      this.colorTheme = 'light';  // Set default theme
    }
  }
}
