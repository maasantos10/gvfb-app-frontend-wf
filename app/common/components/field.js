(function() {
  angular.module('workflowGfbvApp').component('field', {
    bindings: {
      grid: '@',
      id: '@',
      label: '@',
      placeholder: '@',
      type: '@', // precisa usar double mustache {{}}
      model: '=', // bind bidirecional para atualizar o valor - directiva
      readonly: '<', //directiva unidirecional
    },
    controller: [
      'gridSystem',
      function(gridSystem) {
        this.$onInit = () =>  this.gridClasses = gridSystem.toCssClasses(this.grid)
      }
    ],
    template: `
    <div class="{{ $ctrl.gridClasses }}">
      <div class="form-group">
        <label for="{{ $ctrl.id }}">{{ $ctrl.label }}</label>
        <input id="{{ $ctrl.id }}" class="form-control" placeholder="{{ $ctrl.placeholder }}"
          type="{{ $ctrl.type }}" ng-model="$ctrl.model" ng-readonly="$ctrl.readonly" />
      </div>
    </div>
    `
  })
})()
