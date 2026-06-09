/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgGridTranslateService {

  constructor() { }

  public localeText(userLang) {
      switch (userLang) {
          case 'en':
              return ;
          case 'pt':
              return {
                  page : 'Página',
                  more: 'mais',
                  to: 'a',
                  of: 'de',
                  next: 'Próximo',
                  last: 'Último',
                  first: 'Primeiro',
                  previous: 'Anterior',

                  noRowsToShow: 'Não existem registos',

                  // for number filter and text filter
                  filterOoo: 'filtro...',
                  applyFilter: 'Aplicar filtro...',
                  equals: 'Igual',
                  notEquals: 'Não é Igual',

                  // for number filter
                  lessThan: 'Menor que',
                  greaterThan: 'Maior que',
                  lessThanOrEqual: 'Menor ou igual que',
                  greaterThanOrEqual: 'Maior ou igual que',
                  inRange: 'no intervalo',

                  // for text filter
                  contains: 'Contém',
                  notContains: 'Não Contém',
                  startsWith: 'Começa com',
                  endsWith: 'Termina com',

                  // filter conditions
                  andCondition: 'E',
                  orCondition: 'OU',
              };
      }
  }
}
