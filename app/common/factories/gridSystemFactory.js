angular.module('workflowGfbvApp').factory('gridSystem', [ function () {

  function toCssClasses(numbers) {
    // constante que recebe o resultado de uma operação ternária
    /* leitura: se a variável numbers tiver definida (a interrogação é um se faça) será feito
    um split do conteúdo da variável numbers separando por espaços em branco e deverá gerar um
    array com cada um dos números ( os ":" serve para indicar uma segunda função faça).
    Caso o conteúdo de numbers seja inválido ou o resultado da pergunta seja falso, irá retorar
    um array vazio */
    const cols = numbers ? numbers.split(' ') : []
    let classes = ''

    if(cols[0]) classes += `col-xs-${cols[0]}`  // COL-XS-12 - dispositivos pequenos ou celulares / 12 colunas / ocupa a tela toda
    if(cols[1]) classes += ` col-sm-${cols[1]}` // COL-SM-6 - tables / 6 colunas / ocupa metade da tela
    if(cols[2]) classes += ` col-md-${cols[2]}` // COL-MD-4 - Computadores menores, laptops / 4 colunas / ocupa 1/3 da tela
    if(cols[3]) classes += ` col-lg-${cols[3]}` // COL-LG-2 - computadores ou telas maiores / 2 colunas / ocupa 2 colunas de 12

    return classes
  }
  // expondo o método porque uma factory sempre devolve um objeto
  // nova notação. A antiga seria "return { toCssClasses: toCssClasses }"
  // aqui o babel fará o transpile e deixará compatível com os browsers
  // essa factory poderá ser reutilizada.
  return { toCssClasses }
}])
