ai readme idk br

# ESC Log Archive

A small, static website for browsing ESC records. It uses plain HTML, CSS, and JavaScript, with the log entries stored separately in JSON.

## Project structure

```text
esc-log-archive/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── data/
│   └── logs.json
└── README.md
```

## Run it locally

The page loads `data/logs.json` with `fetch()`, so opening `index.html` directly as a `file://` page may block the JSON request.

### Option 1: Python

Open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

### Option 2: VS Code

Open this folder in VS Code, install the **Live Server** extension if needed, then right-click `index.html` and choose **Open with Live Server**.

## Adding a log

Open `data/logs.json` and add another object to the array:

```json
{
  "id": "ESC-004",
  "title": "New record title",
  "date": "DATE WITHHELD",
  "author": "Division name",
  "clearance": "LEVEL 2",
  "status": "INTERNAL",
  "body": "Write the log contents here.\nA blank line can separate paragraphs."
}
```

Make sure each record has a unique `id`, and separate objects with commas. Valid JSON uses double quotes around keys and string values.

## Editing the appearance

Change colours and layout in `css/styles.css`. The main mint accent is defined near the top:

```css
--accent: #5ffbde;
```

## Notes

- No framework or build step is required.
- This is a front-end demo; it does not have user accounts, real access controls, or a server-side database.
- `RESTRICTED` is currently a visual label only, not actual security.
