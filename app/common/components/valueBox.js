angular.module('workflowGfbvApp').component('valueBox', {
  bindings: {
    grid: '@', // aqui é passada a primeira div, a mais externa que contém a classe com a grid do layout da página
    colorClass: '@', // div que contém a definição da cor ou a div que vêm logo na sequência da div da grid
    value: '@', // tag <h3> que contém os valores
    text: '@', //texto na tag <p>
    iconClass: '@', //qual o ícone que irei utilizar. Aqui é uma classe css que representa o ícone. Obs: posso colocar qualquer nome aqui
  },
  // aqui o controller usa o mesmo padrão que o angula usa ao carregar um angular.module para infetar os parâmetros no método (injeção de denpendencia)
  controller: [ // o controller permite que seja inserido comportamentos dentro do component.
    'gridSystem',
    function(gridSystem) {
    this.$onInit = () =>  this.gridClasses = gridSystem.toCssClasses(this.grid)
    }
  ],
  template: `
  <div class="{{ $ctrl.gridClasses }}">
    <div class="small-box {{ $ctrl.colorClass }}">
      <div class="inner">
        <h3>{{ $ctrl.value }}</h3>
        <p>{{ $ctrl.text }}</p>
      </div>
      <div class="icon">
        <i class="fa {{ $ctrl.iconClass }}"></i>
      </div>
    </div>
  </div>
  `
})
