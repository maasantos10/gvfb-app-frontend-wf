/* versão 1.6 do angular */
/* função autoinvocada - assim não pertence mais ao escopo global, deve-se fugir
segundo o guia do john papa */
(function () {
  angular.module('workflowGfbvApp').controller('BillingCycleCtrl', [
    '$http',
    '$location',
    'msgs',
    'tabs',
    'auth',
    BillingCycleController
  ])

  function BillingCycleController($http, $location, msgs, tabs, auth) {
    const vm = this
    const url = 'http://localhost:3003/api/timeCards'
    //const status = "OPEN"
    //status=${status}&

    const emailProfile = auth.getUser().email
    console.log(auth.getUser().email)
    //console.log('BillingCycleController')
    vm.refresh = function () {
      // se a primeira expressão retornar um valor inválido pegue por padrão o valor 1
      const page = parseInt($location.search().page) || 1
      //skip= e o limit= serve para fazer a paginação
      $http.get(`${url}?email=${emailProfile}&skip=${(page - 1) * 10}&limit=10`).then(function(response){
        vm.billingCycle = {gridLineInformation: [{}], department: [{}]}
        vm.billingCycles = response.data

        console.log('response.data.length: ' + response.data.length)

        vm.calculateValues()

        vm.pages = Math.ceil(response.data.length / 10)
        console.log('pages =', vm.pages)
        tabs.show(vm, {tabList: true, tabCreate: true})
        /*
        $http.get(`${url}/count`).then(function(response) {
          // Math.ceil faz um arredondamento pra cima
          // vai calcular a quantidade de páginas por isso precisa arredondar pra acima
          // por exemplo se houverem 24 registros com 10 linhas cada, dividido por 10
          // daria 2.4, ou seja, 3 páginas.
          vm.pages = Math.ceil(response.data.value / 10)
          console.log('pages =', vm.pages)
          tabs.show(vm, {tabList: true, tabCreate: true})
        })
        */

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
      const urlPdfTimeHour = 'http://localhost:3003/api/timeHourFormPdf' // 5ba76b7d5ba609bea092a11b
      const pdfUrl = `${urlPdfTimeHour}/${vm.billingCycle._id}`

      $http.get(`${pdfUrl}`).then(function(response) {
        
        let a = document.createElement("a");
        a.href = "data:application/octet-stream;charset=utf-16le;base64," + encodeURI(response.data);
        a.download = "TimeCard.pdf"
        a.click();
        vm.refresh()
        msgs.addSuccess('PDF created successfuly')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    vm.SendMail = function (billingCycle) {
      vm.billingCycle = billingCycle
      const urlMail = 'http://localhost:3003/api/SendMail' // 5ba76b7d5ba609bea092a11b
      const mailUrl = `${urlMail}/${vm.billingCycle._id}`
      $http.get(`${mailUrl}`).then(function(response) {
        vm.refresh()
        msgs.addSuccess('PDF has been sent by email successfuly')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    //
    vm.create = function () {
      // sign the signature of Employee
      const urlBlockchain = 'http://localhost:3003/api/signDocument'
      $http.get(`${urlBlockchain}`).then(function(response) {

        vm.billingCycle.signatureEmployee = response.data.signatureChain.chain[0].hash
        vm.billingCycle.signatureSupervisor = ''

        if (vm.billingCycle.status === 'APPROVED'){
          msgs.addError('You do not have pemission to create a new form has alraedy APPROVED')
        } else {
          $http.post(url, vm.billingCycle).then(function(response) {
            vm.refresh()
            msgs.addSuccess('Time Card Form created!')
          }).catch(function(response) {
            msgs.addError(response.data.errors)
          })
        }
      })

    }

    // a página list.html que está incluída dentro da tabs.html chama essa rotina.
    vm.showTabUpdate = function(billingCycle) {
        vm.billingCycle = billingCycle
        if (vm.billingCycle.status === 'APPROVED'){
          vm.disableSubmit = true
          msgs.addError('You can not change forms that already have status of APPROVAL')
        } else {
          vm.disableSubmit = false
          vm.calculateValues()
          console.log('calculateValues()')
          tabs.show(vm, {tabUpdate: true})
        }
    }

    vm.showTabDelete = function(billingCycle) {
      vm.billingCycle = billingCycle
      if (vm.billingCycle.status === 'APPROVED' || vm.billingCycle.status === 'APPROVAL' ){
        vm.disableSubmit = true
        msgs.addError('You can not delete forms that already have status of APPROVED or APPROVAL')
      } else {
        vm.disableSubmit = false
        vm.calculateValues()
        console.log('calculateValues()')
        tabs.show(vm, {tabDelete: true})
      }
    }

    vm.update = function() {

      // sign the signature of Employee
      const urlBlockchain = 'http://localhost:3003/api/signDocument'
      $http.get(`${urlBlockchain}`).then(function(response) {
        //console.log(response.data)
        //console.log(response.data.signatureChain.chain[0])
        vm.billingCycle.signatureEmployee = response.data.signatureChain.chain[0].hash
        //vm.billingCycle.signatureSupervisor = ''
        //const {myFormCount = 0} = response.data
        //vm.myFormCount = myFormCount
        //vm.debt = debt
        //vm.total = credit - debt

        if (vm.billingCycle.status === 'APPROVED'){
          msgs.addError('You do not have pemission to create a new form has already APPROVED')
        } else {

          const updateUrl = `${url}/${vm.billingCycle._id}`
          $http.put(updateUrl, vm.billingCycle).then(function(response) {
            vm.refresh()
            msgs.addSuccess('Time Card Form Has been updated!')
          }).catch(function(response) {
            msgs.addError(response.data.errors)
          })
        }

      })

    }

    vm.toapprove = function(billingCycle) {
      vm.billingCycle = billingCycle
      //console.log(vm.billingCycle.status)
      //console.log(vm.billingCycle._id)

      if (vm.billingCycle.status === 'APPROVED' ){
        msgs.addError('You do not have pemission to approve')
      } else if (vm.billingCycle.status === 'APPROVAL') {
        msgs.addError('form already has the status of APPROVAL')
      } else {

        vm.billingCycle.status = 'APPROVAL'
        const updateUrl = `${url}/${vm.billingCycle._id}`
        $http.put(updateUrl, vm.billingCycle).then(function(response) {
          vm.refresh()
          msgs.addSuccess('Time Card Form Has been updated to APPROVAL!')
        }).catch(function(response) {
          msgs.addError(response.data.errors)
        })
      }
    }

    vm.delete = function () {
      const deleteUrl = `${url}/${vm.billingCycle._id}`
      $http.delete(deleteUrl, vm.billingCycle).then(function(response) {
        vm.refresh()
        msgs.addSuccess('Time Card Form Has been deleted!')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    /*
    vm.addCredit = function(index) {
      vm.billingCycle.gridLineInformation.splice(index + 1, 0, {})
    }

    vm.cloneCredit = function(index, {name, value}) {
      vm.billingCycle.gridLineInformation.splice(index + 1, 0, {name, value})
      vm.calculateValues()
    }

    vm.deleteCredit = function(index) {
      if(vm.billingCycle.gridLineInformation.length > 1) {
        vm.billingCycle.gridLineInformation.splice(index, 1)
        vm.calculateValues()
      }
    }
    */

    // funcions to Add, remove or clone lines of grid when the user
    // should be editing something on the front end
    vm.addDebt = function(index) {
      //console.log('addDebt')
      vm.billingCycle.gridLineInformation.splice(index + 1, 0, {})
    }

    vm.cloneDebt = function(index,
                          { monthLineGrid, dayLineGrid, startTime, finishTime
                          , totalTime, lunchTime, reg, overtime, bank, absence}) {
      vm.billingCycle.gridLineInformation.splice(index + 1, 0,
                                               { monthLineGrid, dayLineGrid, startTime, finishTime
                                               , totalTime, lunchTime, reg, overtime, bank, absence})
      vm.calculateValues()
    }

    vm.deleteDebt = function(index) {
      if(vm.billingCycle.gridLineInformation.length > 1) {
        vm.billingCycle.gridLineInformation.splice(index, 1)
        vm.calculateValues()
      }
    }

    vm.calculateValues = function () {
      vm.credit = 0
      vm.debt = 0
      // precisa corrigir aqui
      if(vm.billingCycle) {
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
