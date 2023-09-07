import { Injectable, TemplateRef } from '@angular/core';

@Injectable({  providedIn: 'root'})
export class ToastService {

  toasts: any[] = [];

  info(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, classname: 'bg-info', delay: 10000, ...options })
  }

  success(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, classname: 'bg-success', delay: 10000, ...options })
  }

  warning(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, classname: 'bg-warning', delay: 10000, ...options })
  }

  danger(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, class:'bg-success', classname: 'bg-danger', delay: 10000, ...options })
  }

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	remove(toast:any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}

}
