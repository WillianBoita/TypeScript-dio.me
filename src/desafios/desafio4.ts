// um dia eu termino

interface HttpClientProps {
    url: string,
    method: string,
    body?: Record<string, any> | string | null
}

interface CriarListaProps {
    nomeDaLista: string,
    descricao: string
}

interface AdicionarFilmeNaListaProps {
    filmeId: number,
    listaId: number
}

let apiKey: string;
let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
let listId: string = '7101979';

let addButton = document.getElementById('add-movie') as HTMLButtonElement;
let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let searchContainer = document.getElementById('search-container') as HTMLDivElement;

loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
})

searchButton.addEventListener('click', async () => {
  let lista = document.getElementById("lista") as HTMLUListElement;
  if (lista) {
    lista.outerHTML = "";
  }
  let query = document.getElementById('search') as HTMLInputElement;
  let listaDeFilmes = await procurarFilme(query.value);
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    let button = document.createElement('button')
    button.className = "add-movie"
    button.textContent = "Adicionar Filme"
    li.appendChild(document.createTextNode("ID: "))
    li.appendChild(document.createTextNode(item.id))
    li.appendChild(document.createTextNode(" - "))
    li.appendChild(document.createTextNode(item.original_title))
    li.appendChild(document.createTextNode(" - Popularidade: "))
    li.appendChild(document.createTextNode(item.popularity))
    ul.appendChild(li)
  }

  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
})

addButton.addEventListener('click', async () => {
    
})

function preencherLogin() {
  let userInput = document.getElementById('login') as HTMLInputElement;
  username = userInput.value
  validateLoginButton();
}

function preencherSenha() {
    let passwordInput = document.getElementById('senha') as HTMLInputElement;
    password = passwordInput.value
    validateLoginButton();
}

function preencherApi() {
    let apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
    apiKey = apiKeyInput.value
    validateLoginButton();
}

window.preencherLogin = preencherLogin
window.preencherSenha = preencherSenha
window.preencherApi = preencherApi

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
    searchButton.disabled = false;
    addButton.disabled = false;
  } else {
    loginButton.disabled = true;
    searchButton.disabled = true;
    addButton.disabled = true;
  }
}

class HttpClient {
  static async get({url, method, body = null}: HttpClientProps): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query: string): Promise<Record<string, any>> {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })

  return result
}

async function adicionarFilme(filmeId: number): Promise<void> {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken(): Promise<void> {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  })
  requestToken = result.request_token
}

async function logar(): Promise<void> {
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })

  console.log(result)
}

async function criarSessao(): Promise<void> {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  })
  sessionId = result.session_id;
}

async function criarLista({nomeDaLista, descricao}: CriarListaProps): Promise<void> {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista({filmeId, listaId}: AdicionarFilmeNaListaProps): Promise<void> {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista(): Promise<void> {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  console.log(result);
}