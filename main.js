const inputTarefa = document.querySelector(".nova-tarefa input");
const btn = document.querySelector(".nova-tarefa button");
const lista = document.querySelector(".lista-tarefas");

let idEditado;
let tarefaFoiEditada = false;

//Pega a lista de tarefas no localStorage
let listaDeTarefas = JSON.parse(localStorage.getItem("lista-tarefas"));

function mostrarTarefa() {
  let li = "";

  if (listaDeTarefas) {
    listaDeTarefas.forEach((tarefa, id) => {
      //Se o status da ${tarefa} é completa, coloca o valor checked na variavel
      let statusCompleta = tarefa.status == "completa" ? "checked" : "";
      li += `<li class="tarefa">
              <label for="${id}">
                <input onclick="atualizaStatus(this)" type="checkbox" id="${id}" ${statusCompleta} />
                <p class="${statusCompleta}">${tarefa.nome}</p>
              </label>
              <div class="config">
                <i onclick="mostrarMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="menu-tarefa">
                  <li onclick="editaTarefa(${id}, '${tarefa.nome}')"><i class="uil uil-pen"></i>Editar</li>
                  <li onclick="deletaTarefa(${id})"><i class="uil uil-trash"></i>Delete</li>
                </ul>
              </div>
            </li>`;
    });
  }

  lista.innerHTML = li;
}

mostrarTarefa();

function mostrarMenu(tarefaSelecionada) {
  let menuTarefa = tarefaSelecionada.parentElement.lastElementChild;
  menuTarefa.classList.add("mostra");

  document.addEventListener("click", (e) => {
    //remove a class "mostra" do menuTarefa quando clicar em qualquer lugar do body
    if (e.target.tagName != "I" || e.target != tarefaSelecionada) {
      menuTarefa.classList.remove("mostra");
    }
  });
}

function editaTarefa(idTarefa, nomeTarefa) {
  idEditado = idTarefa;
  tarefaFoiEditada = true;
  inputTarefa.value = nomeTarefa;
}

function deletaTarefa(idTarefa) {
  //Remove a tarefa do array/listaDeTarefas
  listaDeTarefas.splice(idTarefa, 1);
  localStorage.setItem("lista-tarefas", JSON.stringify(listaDeTarefas));
  mostrarTarefa();
}

function atualizaStatus(tarefaSelecionada) {
  //Pega o paragrafo que contem o nome da tarefa
  let nomeTarefa = tarefaSelecionada.parentElement.lastElementChild;
  if (tarefaSelecionada.checked) {
    //atualiza o status da tarefa selecionada para completa
    nomeTarefa.classList.add("checked");
    listaDeTarefas[tarefaSelecionada.id].status = "completa";
  } else {
    //atualiza o status da tarefa selecionada para pendente
    nomeTarefa.classList.remove("checked");
    listaDeTarefas[tarefaSelecionada.id].status = "pendente";
  }
  //Atualiza a informação no localstorage
  localStorage.setItem("lista-tarefas", JSON.stringify(listaDeTarefas));
}

btn.addEventListener("click", (e) => {
  e.preventDefault();

  let tarefaUsuario = inputTarefa.value.trim();

  if (tarefaUsuario) {
    if (!tarefaFoiEditada) {
      if (!listaDeTarefas) {
        // Se "listaDeTarefas" não existir, passa um array vazio
        listaDeTarefas = [];
      }
      let infoTarefa = { nome: tarefaUsuario, status: "pendente" };
      listaDeTarefas.push(infoTarefa); //add a nova tarefa no array/listaDeTarefas
    } else {
      tarefaFoiEditada = false;
      listaDeTarefas[idEditado].nome = tarefaUsuario;
    }

    inputTarefa.value = "";
    //O setItem modifica o localstorage: convertendo o objeto para um arquivo JSON
    localStorage.setItem("lista-tarefas", JSON.stringify(listaDeTarefas));
    mostrarTarefa();
  }
});
