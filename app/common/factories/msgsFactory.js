(function(){
  angular.module('workflowGfbvApp').factory('msgs', [
    'toastr',
    MsgsFactory
  ])

  function MsgsFactory(toastr) {

    function addMsg(msgs, title, method) {
      if(msgs instanceof Array) {
        //toastr que irá imprimir a mensagem
        // ao colocar entre colchetes eu consigo invocar o método mesmo sendo uma string.
        // o correto seria chamar toastr.succes e assim por diante.
        msgs.forEach(msg => toastr[method](msg, title)) // o method contém o metodo que será passado dinamicamente como parâmetro
      } else {
        toastr[method](msgs, title)
      }
    }

    function addSuccess(msgs) {
      addMsg(msgs, 'Sucesso', 'success')
    }

    function addError(msgs) {
      addMsg(msgs, 'Erro', 'error')
    }

    return { addSuccess, addError }
  }
})()
