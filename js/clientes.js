SERVIDOR = 'http://localhost:5000/';

btnNovoCliente.onclick = () => exibir_modal_novo_cliente();


btnSalvarAlteracoesCliente.onclick = function() {
  var dados = ler_clienteForm();
  put_cliente(dados);
};


btnSalvarCliente.onclick = function() {
  var dados = ler_clienteForm();
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
      lblBairroEnderecoCliente.innerHTML = data.bairro;
      lblCidadeEnderecoCliente.innerHTML = data.localidade;
      lblUfEnderecoCliente.innerHTML = data.uf;
      divLocalidadeUfEnderecoCliente.style.opacity = 1;
    }
    else {
      lblLogradouroEnderecoCliente.value = 'Rua / Logradouro / Avenida';
      lblBairroEnderecoCliente.innerHTML = '';
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
  formData.append('numero_endereco', cliente.numeroEndereco);
  formData.append('complemento_endereco', cliente.complemento);

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


function exibir_modal_novo_cliente() {
  titulo.innerHTML = 'Novo Cliente';
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

  const nome = txtNomeCliente.value;
  const cpf = parseInt(txtCpfCliente.value);
  const cepEndereco = parseInt(txtCepEnderecoCliente.value);
  const numeroEndereco = txtNumeroEnderecoCliente.value;
  const complemento = txtComplementoEnderecoCliente.value;

  var cliente = { nome:nome, cpf:cpf, cepEndereco:cepEndereco, numeroEndereco:numeroEndereco, complemento:complemento };

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

  alugueis.forEach(i => {
      var template = divItemTemplate.innerHTML;

      const data_inicio = string_para_date(i.data_inicio);
      const data_termino = string_para_date(i.data_termino);

      html += template.
        replaceAll('[id]', i.id).
        replaceAll('[veiculo]', i.veiculo.modelo).
        replaceAll('[data_inicio]', date_para_texto_dataCurta(data_inicio)).
        replaceAll('[data_termino]', date_para_texto_dataCurta(data_termino)).
        replaceAll('[valor]', decimal_para_texto_moedareal(i.valor));
  });

  divListaClientes_linhas.innerHTML = html;
}