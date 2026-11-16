const list = document.getElementById("logList");
const search = document.getElementById("search");
const errorBox = document.getElementById("error");

let logs = [];
let selectedId = null;



async function loadLogs() {
  try {
    // Get the list of JSON filenames
    const indexResponse = await fetch("data/logs/index.json");

    if (!indexResponse.ok) {
      throw new Error(`Could not load index: HTTP ${indexResponse.status}`);
    }

    const filenames = await indexResponse.json();

    // Load each individual record
    logs = await Promise.all(
      filenames.map(async filename => {
        const response = await fetch(
          `data/logs/${encodeURIComponent(filename)}`
        );

        if (!response.ok) {
          throw new Error(`Could not load ${filename}`);
        }

        return await response.json();
      })
    );

    document.getElementById("recordCount").textContent =
      `${logs.length} RECORDS`;

    errorBox.hidden = true;
    renderList();

    if (logs.length) {
      selectLog(logs[0].id);
    } else {
      document.getElementById("recordCount").textContent = "NO RECORDS";
    }

  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent =
      "Could not load records. Check the index and JSON files.";

    document.getElementById("recordCount").textContent = "DATA UNAVAILABLE";

    console.error(error);
  }
}



function renderList() {
  const term = search.value.trim().toLowerCase();

  const matches = logs.filter(log =>
    `${log.id} ${log.title} ${log.author} ${log.logtype} ${log.body}`
      .toLowerCase()
      .includes(term)
  );

  list.replaceChildren();

  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "NO MATCHING RECORDS";
    list.appendChild(empty);
    return;
  }

  for (const log of matches) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `log-button${log.id === selectedId ? " active" : ""}`;

    const id = document.createElement("span");
    id.className = "id";
    id.textContent = log.id;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = log.title;

    button.append(id, name);
    button.addEventListener("click", () => selectLog(log.id));
    list.appendChild(button);
  }
}

function selectLog(id) {
  const log = logs.find(entry => entry.id === id);
  if (!log) return;

  selectedId = id;
  document.getElementById("crumbId").textContent = log.id;
  document.getElementById("title").textContent = log.title;
  document.getElementById("recordId").textContent = log.id;
  document.getElementById("date").textContent = log.date;
  document.getElementById("author").textContent = log.author;
  document.getElementById("logtype").textContent = log.logtype;

  const status = document.getElementById("status");
  status.textContent = log.status;
  status.className = `status${log.status === "RESTRICTED" ? " restricted" : ""}`;

  document.getElementById("content").textContent = log.body;
  renderList();
}

search.addEventListener("input", renderList);
loadLogs();
