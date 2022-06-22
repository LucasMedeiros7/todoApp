const inputTarefa = document.querySelector(".nova-tarefa input");
const btn = document.querySelector(".nova-tarefa button");
const lista = document.querySelector(".lista-tarefas");

function mostrarTarefa(tarefa) {
  console.log(tarefa);
}
//Cria um localstorage da lista-tarefas
let todos = JSON.parse(localStorage.getItem("lista-tarefas"));

function mostrarTarefa() {
  let li = "";

  if (todos) {
    todos.forEach((todo, id) => {
      //Se o status de ${todo} é completa, coloca o valor check na variavel
      let statusCompleta = todo.status == "completa" ? "checked" : "";
      li += `<li class="tarefa">
              <label for="${id}">
                <input onclick="atualizaStatus(this)" type="checkbox" id="${id}" ${statusCompleta} />
                <p class="${statusCompleta}">${todo.nome}</p>
              </label>
              <div class="config">
                <i onclick="mostrarMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="menu-tarefa">
                  <li><i class="uil uil-pen"></i>Editar</li>
                  <li><i class="uil uil-trash"></i>Delete</li>
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

function atualizaStatus(tarefaSelecionada) {
  //Pega o paragrafo que contem o nome da tarefa
  let nomeTarefa = tarefaSelecionada.parentElement.lastElementChild;
  if (tarefaSelecionada.checked) {
    //atualiza o status da tarefa selecionada para completa
    nomeTarefa.classList.add("checked");
    todos[tarefaSelecionada.id].status = "completa";
  } else {
    //atualiza o status da tarefa selecionada para pendente
    nomeTarefa.classList.remove("checked");
    todos[tarefaSelecionada.id].status = "pendente";
  }
  //Atualiza a informação no localstorage
  localStorage.setItem("lista-tarefas", JSON.stringify(todos));
}

btn.addEventListener("click", (e) => {
  e.preventDefault();

  let tarefa = inputTarefa.value.trim();
  if (tarefa) {
    if (!todos) {
      // Se "todos" não existir, passa um array vazio
      todos = [];
    }

    inputTarefa.value = "";
    let infoTarefa = { nome: tarefa, status: "pendente" };
    todos.push(infoTarefa); //add a nova tarfa no array de toDo's

    //O setItem modifica o localstoragem: convertendo o objeto para um arquivo JSON
    localStorage.setItem("lista-tarefas", JSON.stringify(todos));
    mostrarTarefa();
  }
});
