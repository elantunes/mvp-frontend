SERVIDOR = 'http://localhost:5000/';

btnNovoCliente.onclick = () => exibir_modal_novo_cliente();


btnSalvarAlteracoesCliente.onclick = function() {
  const dados = ler_clienteForm();
  put_cliente(dados);
};


btnSalvarCliente.onclick = function() {
  const dados = ler_clienteForm();
  post_cliente(dados);
};


txtCepEnderecoCliente.onkeyup = function(event) {
  const cep = event.target.value;
  if (cep.length == 8)
    get_informacoes_cep(cep);
  else {
    lblLogradouroEnderecoCliente.innerHTML = 'Rua / Logradouro / Avenida';
    divLocalidadeUfEnderecoCliente.style.opacity = 0;
  }
}


/*
  --------------------------------------------------------------------------------------
  Deleta um cliente via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const delete_cliente = async (id) => {
  const url = `${SERVIDOR}cliente/${id}`;
  fetch(url, {
    method: 'delete',
  })
  .then((response) => response.json())
  .then(function() {
    closeModal(divModalDeleteCliente);
    get_clientes();
    ativar_popup_operacao_com_sucesso();
  }).catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Obtém um cliente via requisição GET
  --------------------------------------------------------------------------------------
*/
const get_cliente = async (id) => {
  const url = `${SERVIDOR}cliente/${id}`;
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then((data) => ativar_editForm(data))
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Obtém uma lista de clientes via requisição GET
  --------------------------------------------------------------------------------------
*/
const get_clientes = async () => {
  const url = `${SERVIDOR}clientes`;
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then(function(data) {
    render_clientes(data.clientes);
  })
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Obtém as informações de um CEP
  --------------------------------------------------------------------------------------
*/
const get_informacoes_cep = async(cep) => {
  const url = `https://viacep.com.br/ws/${cep}/json`;
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then(function(data) {
    if (!data.hasOwnProperty('erro')) {
      lblLogradouroEnderecoCliente.innerHTML = data.logradouro;
      lblLocalidadeEnderecoCliente.innerHTML = data.bairro;
      lblCidadeEnderecoCliente.innerHTML = data.localidade;
      lblUfEnderecoCliente.innerHTML = data.uf;
      divLocalidadeUfEnderecoCliente.style.opacity = 1;
    }
    else {
      lblLogradouroEnderecoCliente.value = 'Rua / Logradouro / Avenida';
      lblLocalidadeEnderecoCliente.innerHTML = '';
      lblCidadeEnderecoCliente.innerHTML = '';
      lblUfEnderecoCliente.innerHTML = '';
    }
  })
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Insere um cliente via requisição POST
  --------------------------------------------------------------------------------------
*/
const post_cliente = async (cliente) => {
  const url = `${SERVIDOR}cliente`;

  const formData = new FormData();

  formData.append('nome', cliente.nome);
  formData.append('cpf', cliente.cpf);
  formData.append('cep_endereco', cliente.cepEndereco);
  formData.append('logradouro_endereco', cliente.logradouroEndereco);
  formData.append('numero_endereco', cliente.numeroEndereco);
  formData.append('complemento_endereco', cliente.complemento);
  formData.append('localidade_endereco', cliente.localidade);
  formData.append('cidade_endereco', cliente.cidade);
  formData.append('uf_endereco', cliente.uf);

  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => response.json())
  .then(() => {
      closeModal(divModalCliente);
      get_clientes();
      ativar_popup_operacao_com_sucesso();
  })
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Altera um cliente via requisição PUT
  --------------------------------------------------------------------------------------
*/
const put_cliente = async (cliente) => {
  const url = `${SERVIDOR}cliente/${cliente.id}`;

  const formData = new FormData();

  formData.append('nome', cliente.nome);
  formData.append('cpf', cliente.cpf);
  formData.append('cep_endereco', cliente.cepEndereco);
  formData.append('logradouro_endereco', cliente.logradouroEndereco);
  formData.append('numero_endereco', cliente.numeroEndereco);
  formData.append('complemento_endereco', cliente.complemento);
  formData.append('localidade_endereco', cliente.localidade);
  formData.append('cidade_endereco', cliente.cidade);
  formData.append('uf_endereco', cliente.uf);

  delete cliente.id;

  fetch(url, {
    method: 'put',
    body: formData
  })
  .then((response) => response.json())
  .then(() => {
    closeModal(divModalCliente);
    get_clientes();
    ativar_popup_operacao_com_sucesso();
  })
  .catch((error) => console.error('Error:', error));
}


function ativar_confirmacao_delecao(id) {
  hidIdModalDeleteCliente.value = id;
  divModalDeleteCliente.style.display = 'flex';
}


function ativar_editForm(cliente) {
  document.querySelector('#divModalCliente #titulo').innerHTML = 'Editar Cliente';

  hiddenId.value = cliente.id;

  txtNomeCliente.value = cliente.nome;
  txtCpfCliente.value = cliente.cpf;
  txtCepEnderecoCliente.value = cliente.cep_endereco;
  lblLogradouroEnderecoCliente.innerHTML = cliente.logradouro_endereco;
  txtNumeroEnderecoCliente.value = cliente.numero_endereco;
  txtComplementoEnderecoCliente.value = cliente.complemento_endereco;
  lblLocalidadeEnderecoCliente.innerHTML = cliente.localidade_endereco;
  lblCidadeEnderecoCliente.innerHTML = cliente.cidade_endereco;
  lblUfEnderecoCliente.innerHTML = cliente.uf_endereco;

  btnSalvarCliente.style.display = 'none';
  btnSalvarAlteracoesCliente.style.display = 'block';

  divLocalidadeUfEnderecoCliente.style.opacity = 1;
  divModalCliente.style.display = 'flex';
}


function ativar_popup_operacao_com_sucesso() {
  const div = $('.popup-operacao-sucesso');
    div.animate({top: '10'}, 500, function() { setTimeout(function() { div.animate({top: '-69'}, 'fast') }, 3000) });
}


function exibir_modal_novo_cliente() {
  document.querySelector('#divModalCliente #titulo').innerHTML = 'Novo Cliente';

  divLocalidadeUfEnderecoCliente.style.opacity = 0;
  txtNomeCliente.value = '';
  txtCpfCliente.value = '';
  txtCepEnderecoCliente.value = '';
  lblLogradouroEnderecoCliente.innerHTML = 'Rua / Logradouro / Avenida';
  txtNumeroEnderecoCliente.value = '';
  txtComplementoEnderecoCliente.value = '';

  btnSalvarCliente.style.display = 'block';
  btnSalvarAlteracoesCliente.style.display = 'none';

  divModalCliente.style.display = 'flex';
}

function ler_clienteForm() {

  const id = parseInt(hiddenId.value);
  const nome = txtNomeCliente.value;
  const cpf = parseInt(txtCpfCliente.value);
  const cepEndereco = parseInt(txtCepEnderecoCliente.value);
  const logradouroEndereco = lblLogradouroEnderecoCliente.innerHTML;
  const numeroEndereco = txtNumeroEnderecoCliente.value;
  const complemento = txtComplementoEnderecoCliente.value;
  const localidade = lblLocalidadeEnderecoCliente.innerHTML;
  const cidade = lblCidadeEnderecoCliente.innerHTML;
  const uf = lblUfEnderecoCliente.innerHTML;

  var cliente = {
    id: id,
    nome: nome,
    cpf: cpf,
    cepEndereco: cepEndereco,
    logradouroEndereco: logradouroEndereco,
    numeroEndereco: numeroEndereco,
    complemento: complemento,
    localidade: localidade,
    cidade: cidade,
    uf: uf
  };

  return cliente;
}


function render_clientes(clientes) {
  let html = '';

  if (clientes.length == 0) {
    divNaoHaClientes.style.display = 'block';
    divListaClientes_linhas.style.display = 'none';
    return;
  }

  divNaoHaClientes.style.display = 'none';
  divListaClientes_linhas.style.display = 'block';

  clientes.forEach(i => {
      var template = divItemTemplate.innerHTML;

      html += template.
        replaceAll('[id]', i.id).
        replaceAll('[nome]', i.nome).
        replaceAll('[cpf]', i.cpf);
  });

  divListaClientes_linhas.innerHTML = html;
}
