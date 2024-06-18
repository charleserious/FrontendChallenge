import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_NC_EVENT,
  deleteNCEvent,
  getEventFromLocalStorage,
  saveNCEventDueDate,
  saveNCEventTitle,
} from '../storage';

import type { NCEvent } from '../storage';

type TextResizerInput = {
  elementId: string;
  maxTextSize: number;
  minTextSize: number;
};

const DEFAULT_TIME_REMAINING_TEXT = 'Enter Event Date';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  ncEvent: NCEvent;
  remaining: string = '';
  tickId: number = 0;

  constructor() {
    this.ncEvent = getEventFromLocalStorage();
  }

  ngOnInit(): void {
    this.updateRemaining();
    this.adjustFontSize();
    this.startInterval();
  }

  ngOnDestroy(): void {
    if (!this.tickId) return;

    clearInterval(this.tickId);
  }

  get title(): string {
    const { title } = this.ncEvent;
    return title ? `Time to ${title}` : 'Enter Event Title';
  }

  startInterval() {
    if (!this.ncEvent.dueDate) return; // Check if there's a due date before starting

    this.tickId = window.setInterval(() => this.updateRemaining(), 1000);
  }

  calculateRemainingTime(dueDate: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  updateRemaining(): void {
    const { dueDate } = this.ncEvent;
    if (!dueDate || isNaN(dueDate.getTime())) {
      this.remaining = DEFAULT_TIME_REMAINING_TEXT;
      return;
    }

    const { days, hours, minutes, seconds } = this.calculateRemainingTime(dueDate);

    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
      this.remaining = 'Event has passed';
      return;
    }

    this.remaining = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`;
  }

  handleNCEventTitleChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    if (!value) {
      saveNCEventTitle('');
    }

    this.ncEvent.title = value;
    saveNCEventTitle(value);

    this.adjustFontSize();
  }

  resetDate(): void {
    this.ncEvent.dueDate = null;
    this.remaining = DEFAULT_TIME_REMAINING_TEXT;
    saveNCEventDueDate(null);
  }

  handleNCEventDueDateChange(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    if (!value) {
      this.resetDate();
      return;
    }
    const newDate = new Date(`${value} 24:00:00`); // make this end of the day

    if (isNaN(newDate.getTime())) {
      this.resetDate();
      return;
    }

    this.ncEvent.dueDate = newDate;
    saveNCEventDueDate(newDate);
    this.updateRemaining();
    this.startInterval();
  }

  handleClear(): void {
    this.ncEvent = { ...DEFAULT_NC_EVENT };
    this.remaining = DEFAULT_TIME_REMAINING_TEXT;

    deleteNCEvent();
    this.adjustFontSize();

    if (!this.tickId) return;
    clearInterval(this.tickId);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.adjustFontSize();
  }

  measureTextWidth(element: HTMLElement): number {
    const measuringElement = document.createElement('span');
    measuringElement.style.display = 'inline-block';
    measuringElement.style.visibility = 'hidden';
    measuringElement.style.position = 'absolute';

    measuringElement.textContent = element.textContent;
    measuringElement.style.fontSize = element.style.fontSize;
    measuringElement.style.fontFamily = element.style.fontFamily;

    document.body.appendChild(measuringElement);
    const textWidth = measuringElement.offsetWidth;
    document.body.removeChild(measuringElement);

    return textWidth;
  }

  textResizer({ elementId, maxTextSize, minTextSize }: TextResizerInput): void {
    const container = document.querySelector('.countdown');
    const element = document.querySelector<HTMLElement>(elementId);
    if (!container || !element) return;

    const containerWidth = (container as HTMLDivElement).offsetWidth;
    let fontSize = minTextSize;
    element.style.fontSize = `${fontSize}vw`;

    while (true) {
      const textWidth = this.measureTextWidth(element);

      if (textWidth <= containerWidth && fontSize < maxTextSize) {
        fontSize++;
        element.style.fontSize = `${fontSize}vw`;
      } else {
        break;
      }
    }
  }

  adjustFontSize(): void {
    [
      {
        elementId: '.countdown__title',
        maxTextSize: 8,
        minTextSize: 2,
      },
      {
        elementId: '.countdown__remaining',
        maxTextSize: 9,
        minTextSize: 4,
      },
    ].forEach(this.textResizer.bind(this));
  }
}
