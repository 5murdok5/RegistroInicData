import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'registration'
})
export class RegistrationPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
