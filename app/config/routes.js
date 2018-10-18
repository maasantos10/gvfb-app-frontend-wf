angular.module('workflowGfbvApp').config([
  '$stateProvider', // está presente dentro do iu.router e serve para fazer a navegação
  '$urlRouterProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider) { //(injeção de dependência)
    $stateProvider.state('dashboard', { // ui.router é como se fosse uma máquina de estado
      url: "/dashboard",
      templateUrl: "dashboard/dashboard.html" //O ui.router carregará a página dentro div class="content-wrapper" ui-view da página index.html
    }).state('billingCycle', { // segundo state
      url: "/billingCycles?page", // precisa incluir aqui o parâmetro page caso contrário não será permitido
      templateUrl: "billingCycle/tabs.html"
    }).state('supervisorApproval', { // segundo state
      url: "/supervisorApprovals?page", // precisa incluir aqui o parâmetro page caso contrário não será permitido
      templateUrl: "supervisorApproval/tabs.html"
    })

    // essa rota foi comentada porque estava dando problema com a rota mais abaixo pois eram iguais
    //$urlRouterProvider.otherwise('/dashboard') // um state padrão, caso não localize ou não abra as páginas acima

    //será chamado quando uma menssagem de erro ocorrer.
    // quando um erro é detectado ele direciona para a página de HandleResponseErrorFactory
    // que contém o tratamento para redirecionar para a página de login.
    $httpProvider.interceptors.push('handleResponseError')
  }
])
.run([
  '$rootScope',
  '$http',
  '$location',
  '$window',
  'auth',
function ($rootScope, $http, $location, $window, auth) {
  console.log('Executando....')

  validateUser()
  $rootScope.$on('$locationChangeStart', () => validateUser())

  function validateUser() {

    const user = auth.getUser()
    const authPage = '/auth.html'
    const isAuthPage = $window.location.href.includes(authPage)
    if (!user && !isAuthPage) {
      $window.location.href = authPage
    } else if (user && !user.isValid) {

      auth.validateToken(user.token, (err, valid) => {
        if (!valid) {
          $window.location.href = authPage
        } else {
          user.isValid = true
          $http.defaults.headers.common.Authorization = user.token
          isAuthPage ? $window.location.href = '/' : $location.path('/dashboard')
        }
      })

      /*
      user.isValid = true
      $http.defaults.headers.common.Authorization = user.token
      isAuthPage ? $window.location.href = '/' : $location.path('/dashboard')
      */
    }
  }
}
])
