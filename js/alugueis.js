SERVIDOR = 'http://localhost:5000/';

btnNovoAluguel.onclick = () => ativar_newForm();

btnSalvarAluguel.onclick = function() {
  
  if (selModeloVeiculo.value == '') {
    alert('Informe o veículo');
    return false;
  }

  const dados = ler_aluguelForm();
  post_aluguel(dados);
};


btnSalvarAlteracoesAluguel.onclick = function() {
  const dados = ler_aluguelForm();
  put_aluguel(dados);
};


dateDataInicio.onchange = function(){
  calcular_valor_total_aluguel();
};


dateDataTermino.onchange = function(){
  calcular_valor_total_aluguel();
};


selModeloVeiculo.onchange = function(){
  calcular_valor_total_aluguel();
};


/*
  --------------------------------------------------------------------------------------
  Deleta um aluguel via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const delete_aluguel = async (idAluguel) => {
  const url = `${SERVIDOR}aluguel/${idAluguel}`;
  fetch(url, {
    method: 'delete',
  })
  .then((response) => response.json())
  .then(function() {
    closeModal(divModalDeleteAluguel);
    get_alugueis();
    ativar_popup_operacao_com_sucesso();
  }).catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Obtém uma lista de aluguéis via requisição GET
  --------------------------------------------------------------------------------------
*/
const get_alugueis = async () => {
  const url = `${SERVIDOR}alugueis`;
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then(function(data) {
    render_alugueis(data.alugueis);
  })
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Obtém um aluguel via requisição GET
  --------------------------------------------------------------------------------------
*/
const get_aluguel = async (id) => {
  const url = `${SERVIDOR}aluguel/${id}`;
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then((data) => ativar_editForm(data))
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Obtém uma lista de modelos veículos via requisição GET
  --------------------------------------------------------------------------------------
*/
const get_modelos_veiculos = async () => {
  const url = `${SERVIDOR}veiculos`;
  fetch(url, {
    method: 'get',
  })
  .then((response) => response.json())
  .then(function(data) {
    for(var veiculo of data.veiculos)
      selModeloVeiculo.innerHTML += `<option value='${veiculo.id_veiculo}' data-valordiaria='${veiculo.valor_diaria}'>${veiculo.modelo}</option>`;
  })
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Insere um aluguel via requisição POST
  --------------------------------------------------------------------------------------
*/
const post_aluguel = async (aluguel) => {
  const url = `${SERVIDOR}aluguel`;

  const formData = new FormData();
  formData.append('id_veiculo', aluguel.id_veiculo);
  formData.append('data_inicio', aluguel.data_inicio + ' 00:00:00');
  formData.append('data_termino', aluguel.data_termino + ' 00:00:00');

  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => response.json())
  .then(() => {
      closeModal(divModalAluguel);
      get_alugueis();
      ativar_popup_operacao_com_sucesso();
  })
  .catch((error) => console.error('Error:', error));
}


/*
  --------------------------------------------------------------------------------------
  Altera um aluguel via requisição PUT
  --------------------------------------------------------------------------------------
*/
const put_aluguel = async (aluguel) => {
  const url = `${SERVIDOR}aluguel/${aluguel.id}`;

  const formData = new FormData();
  formData.append('id_veiculo', aluguel.id_veiculo);
  formData.append('data_inicio', aluguel.data_inicio + ' 00:00:00');
  formData.append('data_termino', aluguel.data_termino + ' 00:00:00');

  delete aluguel.id;

  fetch(url, {
    method: 'put',
    body: formData
  })
  .then((response) => response.json())
  .then(() => {
    closeModal(divModalAluguel);
    get_alugueis();
    ativar_popup_operacao_com_sucesso();
  })
  .catch((error) => console.error('Error:', error));
}


function ativar_confirmacao_delecao(idAluguel) {
  hiddenIdAluguelModalDeleteAluguel.value = idAluguel;
  divModalDeleteAluguel.style.display = 'flex';
}


function ativar_editForm(aluguel) {
  titulo.innerHTML = 'Editar Aluguel';

  const data_inicio = string_para_date(aluguel.data_inicio);
  const data_termino = string_para_date(aluguel.data_termino);

  hiddenId.value = aluguel.id;
  selModeloVeiculo.value = aluguel.veiculo.id;
  dateDataInicio.valueAsDate = data_inicio;
  dateDataTermino.valueAsDate = data_termino;

  render_infos_aluguel(aluguel.veiculo.valor_diaria, calcular_numero_dias(data_inicio, data_termino));

  btnSalvarAluguel.style.display = 'none';
  btnSalvarAlteracoesAluguel.style.display = 'block';

  divModalAluguel.style.display = 'flex';
}


function ativar_newForm() {
  titulo.innerHTML = 'Novo Aluguel';

  const data_inicio = new Date();
  const data_termino = new Date();

  selModeloVeiculo.value = '';
  dateDataInicio.valueAsDate = data_inicio;
  dateDataTermino.valueAsDate = data_termino;

  render_infos_aluguel(null, calcular_numero_dias(data_inicio, data_termino));

  btnSalvarAluguel.style.display = 'block';
  btnSalvarAlteracoesAluguel.style.display = 'none';

  divModalAluguel.style.display = 'flex';
}


function ativar_popup_operacao_com_sucesso() {
  const div = $('.popup-operacao-sucesso');
    div.animate({top: '10'}, 500, function() { setTimeout(function() { div.animate({top: '-69'}, 'fast') }, 3000) });
}


/*
  --------------------------------------------------------------------------------------
  Calcula o número de dias de um intervalo de duas datas
  --------------------------------------------------------------------------------------
*/
function calcular_numero_dias (data_inicio, data_termino) {
  const diffTime = Math.abs(data_inicio - data_termino);
  const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return dias;
}


function calcular_valor_total_aluguel() {
  const veiculo = document.querySelector('option:checked').value;
  const valor_diaria = veiculo != '' ? parseFloat(document.querySelector('option:checked').dataset.valordiaria) : null;
  const data_inicio = new Date(dateDataInicio.value);
  const data_termino = new Date(dateDataTermino.value);
  const dias = calcular_numero_dias(data_inicio, data_termino);

  render_infos_aluguel(valor_diaria, dias);
}


function ler_aluguelForm() {

  const id = hiddenId.value;
  const id_veiculo = parseInt(selModeloVeiculo.value);
  const data_inicio = dateDataInicio.value;
  const data_termino = dateDataTermino.value;

  var aluguel = { id: id, id_veiculo: id_veiculo, data_inicio: data_inicio, data_termino:data_termino };
  return aluguel;
}


function render_alugueis(alugueis) {
    let html = '';

    if (alugueis.length == 0) {
      divNaoHaAlugueis.style.display = 'block';
      divListaAlugueis_linhas.style.display = 'none';
      return;
    }

    divNaoHaAlugueis.style.display = 'none';
    divListaAlugueis_linhas.style.display = 'block';

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

    divListaAlugueis_linhas.innerHTML = html;
}

function render_infos_aluguel(valor_diaria, dias) {
  divValorDiariaVeiculo.innerHTML = valor_diaria != null ? decimal_para_texto_moedareal(valor_diaria) : '-';
  divDias.innerHTML = dias
  divTotal.innerHTML = valor_diaria != null ? decimal_para_texto_moedareal(valor_diaria * dias) : '-';
}
