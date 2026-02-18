import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyName'
})
export class PrettyNamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
