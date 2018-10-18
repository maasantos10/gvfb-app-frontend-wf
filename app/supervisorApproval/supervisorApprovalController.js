/* versão 1.6 do angular */
/* função autoinvocada - assim não pertence mais ao escopo global, deve-se fugir
segundo o guia do john papa */
(function () {
  angular.module('workflowGfbvApp').controller('SupervisorApprovalCtrl', [
    '$http',
    '$location',
    'msgs',
    'tabs',
    'auth',
    SupervisorApprovalController
  ])

  function SupervisorApprovalController($http, $location, msgs, tabs, auth) {
    const vm = this
    const url = 'http://localhost:3003/api/timeCards'

    const emailSupervisor = auth.getUser().email
    const status = "APPROVAL"
    const signatureSup = ""

    vm.refresh = function () {
      // se a primeira expressão retornar um valor inválido pegue por padrão o valor 1
      const page = parseInt($location.search().page) || 1
      //skip= e o limit= serve para fazer a paginação
      $http.get(`${url}?status=${status}&skip=${(page - 1) * 10}&limit=10`).then(function(response){
        vm.supervisorApproval = {gridLineInformation: [{}], department: [{}]}
        vm.supervisorApprovals = response.data

        vm.calculateValues()

        vm.pages = Math.ceil(response.data.length / 10)
        tabs.show(vm, {tabList: true, tabCreate: true})

      })
    }

    //blockchain
    // vm means ViewModel accordingly with john papa
    vm.signDocumentBlockchain = function () {
      const urlBlockchain = 'http://localhost:3003/api/signDocument'
      $http.get(`${urlBlockchain}`).then(function(chain) {
        console.log(chain.data)
      })
    }

    vm.pdf = function (billingCycle) {

      vm.billingCycle = billingCycle
      const urlPdfTimeHour = 'http://localhost:3003/api/timeHourFormPdf'
      const pdfUrl = `${urlPdfTimeHour}/${vm.billingCycle._id}`

      $http.get(`${pdfUrl}`).then(function(response) {

        let a = document.createElement("a");
        a.href = "data:application/octet-stream;charset=utf-16le;base64," + encodeURI(response.data);
        a.download = "TimeCard.pdf"
        a.click();
        vm.refresh()

        msgs.addSuccess('PDF has been created successfuly')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })

    }

    vm.SendMail = function (billingCycle) {
      vm.billingCycle = billingCycle
      const urlMail = 'http://localhost:3003/api/SendMail' // 5ba76b7d5ba609bea092a11b
      const mailUrl = `${urlMail}/${vm.billingCycle._id}`
      $http.get(`${mailUrl}`).then(function(response) {
        //console.log('result mail: ' + response.data)
        vm.refresh()
        msgs.addSuccess('PDF has been sent by email successfuly')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    // a página list.html que está incluída dentro da tabs.html chama essa rotina.
    vm.showTabUpdate = function(supervisorApproval) {

      vm.supervisorApproval = supervisorApproval
      //console.log('atribuiu o valor billingCycle ao vm.billingCycle')
      if (vm.supervisorApproval.status === 'APPROVED'){
        vm.disableSubmit = true
        msgs.addError('You can not change forms that already have status of APPROVED')
      } else {
        vm.disableSubmit = false
        vm.calculateValues()
        console.log('calculateValues()')
        tabs.show(vm, {tabUpdate: true})
      }
    }

    vm.update = function() {

      const urlBlockchain = 'http://localhost:3003/api/signDocument'
      $http.get(`${urlBlockchain}`).then(function(response) {
        console.log(response.data)
        console.log(response.data.signatureChain.chain[0])
        vm.supervisorApproval.signatureSupervisor = response.data.signatureChain.chain[0].hash

        vm.supervisorApproval.emailSupervisor = emailSupervisor
        vm.supervisorApproval.status = 'APPROVED'
        const updateUrl = `${url}/${vm.supervisorApproval._id}`
        $http.put(updateUrl, vm.supervisorApproval).then(function(response) {
          vm.refresh()
          msgs.addSuccess('Form Approved successfuly!')
          //send mail message
        }).catch(function(response) {
          msgs.addError(response.data.errors)
        })

      })

    }

    vm.review = function() {
      vm.supervisorApproval.emailSupervisor = emailSupervisor
      vm.supervisorApproval.status = 'REVIEW'
      const updateUrl = `${url}/${vm.supervisorApproval._id}`
      $http.put(updateUrl, vm.supervisorApproval).then(function(response) {
        vm.refresh()
        msgs.addSuccess('Time Card Form sent to review!')
        //send mail message
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    vm.calculateValues = function () {
      vm.credit = 0
      vm.debt = 0
      // precisa corrigir aqui
      if(vm.supervisorApproval) {
        console.log('calculateValues get in')
        /*
        // for para buscar os valores de credits em billingCycle e sumarizá-los
        vm.billingCycle.credits.forEach(function({value}) {
          //atribuição aditiva:
          // se o valor não estiver setado "!value" ou "||" ele não for
          // um número "isNaN()" retorne "?" 0. Se ele for um número ":"
          // e estiver setado faz um parse do valor "parseFloat(value)"
          vm.credit += !value || isNaN(value) ? 0 : parseFloat(value)
        })
        */
        // for para buscar os valores de debits em billingCycle e sumarizá-los
        /*
        vm.billingCycle.debts.forEach(function({value}) {
          //atribuição aditiva: idem acima
          vm.debt += !value || isNaN(value) ? 0 : parseFloat(value)
        })
        */
      }
      vm.total = 0 //vm.credit - vm.debt
    }

    vm.refresh()
  }
})()
