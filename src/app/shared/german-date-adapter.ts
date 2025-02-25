import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Injectable()
export class GermanDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    }
    return date.toDateString();
  }

  override parse(value: string): Date | null {
    if (!value) return null;

    const parts = value.split('-');
    if (parts.length === 3) {
      const day = +parts[0];
      const month = +parts[1] - 1;
      const year = +parts[2];

      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  }
}