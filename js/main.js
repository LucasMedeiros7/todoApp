const inputTarefa = document.querySelector(".nova-tarefa input");
const btn = document.querySelector(".nova-tarefa button");
const listaDeTarefas = document.querySelector(".lista-tarefas");
const filtros = document.querySelectorAll(".filtros span");
const limparTodas = document.querySelector(".btn-limpar");

let idEditado;
let tarefaFoiEditada = false;

//Pega a lista de tarefas no localStorage
let armazenamentoDeTarefas = JSON.parse(localStorage.getItem("lista-tarefas"));

filtros.forEach((status) => {
  status.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    status.classList.add("active");
    mostrarTarefa(status.id);
  });
});

function mostrarTarefa(filtro) {
  let li = "";
  console.log(li);

  if (armazenamentoDeTarefas) {
    armazenamentoDeTarefas.forEach((tarefa, id) => {
      //Se o status da ${tarefa} é completa, coloca o valor checked na variavel
      let statusCompleta = tarefa.status == "completa" ? "checked" : "";

      if (filtro == tarefa.status || filtro == "todas") {
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
      }
    });
  }

  listaDeTarefas.innerHTML =
    li ||
    `Você não possui tarefas ${filtro == "todas" ? "aqui" : filtro + "s"}`;
}

mostrarTarefa("todas");

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
  //Remove a tarefa do array/armazenamentoDeTarefas
  armazenamentoDeTarefas.splice(idTarefa, 1);
  localStorage.setItem("lista-tarefas", JSON.stringify(armazenamentoDeTarefas));
  mostrarTarefa("todas");
}

limparTodas.addEventListener("click", () => {
  //Remove todas as tarefas do array/armazenamentoDeTarefas
  armazenamentoDeTarefas.splice(0, armazenamentoDeTarefas.length);
  localStorage.setItem("lista-tarefas", JSON.stringify(armazenamentoDeTarefas));
  mostrarTarefa();
});

function atualizaStatus(tarefaSelecionada) {
  //Pega o paragrafo que contem o nome da tarefa
  let nomeTarefa = tarefaSelecionada.parentElement.lastElementChild;
  if (tarefaSelecionada.checked) {
    //atualiza o status da tarefa selecionada para completa
    nomeTarefa.classList.add("checked");
    armazenamentoDeTarefas[tarefaSelecionada.id].status = "completa";
  } else {
    //atualiza o status da tarefa selecionada para pendente
    nomeTarefa.classList.remove("checked");
    armazenamentoDeTarefas[tarefaSelecionada.id].status = "pendente";
  }
  //Atualiza a informação no localstorage
  localStorage.setItem("lista-tarefas", JSON.stringify(armazenamentoDeTarefas));
}

btn.addEventListener("click", (e) => {
  e.preventDefault();

  let tarefaUsuario = inputTarefa.value
    .trim()
    .replaceAll("<", "&lt")
    .replaceAll(">", "&gt");

  if (tarefaUsuario) {
    if (!tarefaFoiEditada) {
      if (!armazenamentoDeTarefas) {
        // Se "armazenamentoDeTarefas" não existir, passa um array vazio
        armazenamentoDeTarefas = [];
      }
      let infoTarefa = { nome: tarefaUsuario, status: "pendente" };
      armazenamentoDeTarefas.push(infoTarefa); //add a nova tarefa no array/armazenamentoDeTarefas
    } else {
      tarefaFoiEditada = false;
      armazenamentoDeTarefas[idEditado].nome = tarefaUsuario;
    }

    inputTarefa.value = "";
    //O setItem modifica o localstorage: convertendo o objeto para um arquivo JSON
    localStorage.setItem(
      "lista-tarefas",
      JSON.stringify(armazenamentoDeTarefas)
    );
    mostrarTarefa("todas");
  }
});
