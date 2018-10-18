(function () {
  angular.module('workflowGfbvApp').controller('MenuCtrl', [
    '$http',
    '$location',
    'msgs',
    'auth',
    MenuController
  ])

  function MenuController($http, $location, msgs, auth) {
    const vm = this

    //vm.getUser = () => auth.getUser()
    console.log('MenuController')

    //show menu itens accordingly with employeeType
    if (auth.getUser().employeeType === 'SUPERVISOR'){
      vm.disableShow = true
    } else {
      vm.disableShow = false
    }

    //functions of charts
    //const url = 'http://localhost:3003/api/timeCardSummary'
    // vm means ViewModel accordingly with john papa
    vm.getSummaryFormByEmployee = function () {

      const emailProfile = auth.getUser().email

      console.log('email: getSummaryFormByEmployee: ' + auth.getUser().email)

      const urlGroupHours = 'http://localhost:3003/api/groupHoursByEmployee'
      //totals form Time HOURS Group
      $http.get(`${urlGroupHours}`).then(function(responseGroup) {
        //vm.dataSet = response.data
        console.log(responseGroup.data)

        vm.emailOne = responseGroup.data[0]._id.email
        vm.countOne = responseGroup.data[0].count
        vm.totalHoursOne = responseGroup.data[0].totalHours

        vm.emailTwo = responseGroup.data[1]._id.email
        vm.countTwo = responseGroup.data[1].count
        vm.totalHoursTwo = responseGroup.data[1].totalHours

        vm.emailThree = responseGroup.data[2]._id.email
        vm.countThree = responseGroup.data[2].count
        vm.totalHoursThree = responseGroup.data[2].totalHours

        vm.emailFour = responseGroup.data[3]._id.email
        vm.countFour = responseGroup.data[3].count
        vm.totalHoursFour = responseGroup.data[3].totalHours

        /*console.log(responseGroup.data[0].count)
        console.log(responseGroup.data[0].totalHours)
        console.log(responseGroup.data[0]._id.email)
        */

      })
    }
    vm.getSummaryFormByEmployee()

  }

})()
