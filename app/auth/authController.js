(function () {
  angular.module('workflowGfbvApp').controller('AuthCtrl', [
    '$location',
    'msgs',
    'auth',
    AuthController
  ])

  function AuthController($location, msgs, auth) {
    const vm = this

    vm.loginMode = true

    vm.changeMode = () => vm.loginMode = !vm.loginMode

    vm.login = () => {
      auth.login(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
    }

    vm.signup = () => {
      auth.signup(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
    }

    vm.getUser = () => auth.getUser()
    console.log('aqui ')

    vm.logout = () => {
      auth.logout(() => $location.path('/'))
      //auth.logout(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
      //console.log('chamou o logout do authFactor e voltou')
      //auth.logout(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
    }

    vm.signDocument = () => {
      auth.signDocument(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
    }

  }

})()
