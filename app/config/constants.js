angular.module('workflowGfbvApp').constant('consts', {
  appName: 'Form Workflow - GFBV',
  version: '1.0',
  owner: 'Marcos Santos',
  year: '2018',
  site: 'https://foodbank.bc.ca/',
  apiUrl: 'http://localhost:3003/api',
  oapiUrl: 'http://localhost:3003/oapi',
  userKey: '_primeira_app_user',
}).run(['$rootScope', 'consts', function($rootScope, consts) {
  $rootScope.consts = consts
}])
