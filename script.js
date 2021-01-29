const modal = {
  open(){
    //Abre o modal
    //Adiciona a classe active ao modal

    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
  },

  close(){
    //Fecha o modal
    //Remove a classe active do modal

    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
  }
}