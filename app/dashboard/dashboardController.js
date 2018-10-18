/* versão 1.6 do angular */
/* função autoinvocada - assim não pertence mais ao escopo global, deve-se fugir
segundo o guia do john papa */
(function() {
  angular.module('workflowGfbvApp').controller('DashboardCtrl', [
    '$http',
    'auth',
    DashboardController
  ])

  function DashboardController($http, auth) {

    const vm = this
    const url = 'http://localhost:3003/api/timeCardSummary'
    // vm means ViewModel accordingly with john papa
    vm.getSummaryFormByEmployee = function () {

      const emailProfile = auth.getUser().email

      console.log('email: getSummaryFormByEmployee: ' + auth.getUser().email)

      //total form Time HOURS
      $http.get(`${url}/${emailProfile}`).then(function(response) {
        console.log(response.data)
        const {myFormCount = 0} = response.data
        vm.myFormCount = myFormCount
        //vm.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Quatro", "Cinco"];
        //vm.data = [300, 500, 100, 700, 600];
      })

      const urlGroupHours = 'http://localhost:3003/api/groupHoursByEmployee'
      //totals form Time HOURS Group everybody
      $http.get(`${urlGroupHours}`).then(function(responseGroup) {
        //vm.dataSet = response.data
        console.log(responseGroup.data)
        vm.email = responseGroup.data[0]._id.email
        vm.count = responseGroup.data[0].count
        vm.totalHours = responseGroup.data[0].totalHours
        console.log(responseGroup.data[0].count)
        console.log(responseGroup.data[0].totalHours)
        console.log(responseGroup.data[0]._id.email)
      })
    }
    vm.getSummaryFormByEmployee()

    //this rotine was created because the chart just it will be created when the function
    //windown.onload is calling

    vm.load = function() {
      //alert("Window is loaded");

      const emailProfile = auth.getUser().email

      console.log('email window.onload: ' + auth.getUser().email)

      $http.get(`${url}/${emailProfile}`).then(function(response) {
        console.log(response.data)
        const {myFormCount = 0} = response.data
        vm.myFormCount = myFormCount
        //vm.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Mail-Order Sales", "Cinco"];
        //vm.data = [300, 500, 100, 700, 600];
      })

      window.onload()
    }
    vm.load()
  }
})()


/*
versão 1.5.9 do angular
angular.module('primeiraApp').controller('DashboardCtrl', [
  '$scope',
  '$http',
  DashboardController
])


function DashboardController($scope, $http) {

  $scope.getSummary = function() {
    const url = 'http://localhost:3003/api/billingSummary'
    $http.get(url).success(function({credit = 0, debt = 0}) {
      $scope.credit = credit
      $scope.debt = debt
      $scope.total = credit - debt
    })
  }

  $scope.getSummary()
}
*/
