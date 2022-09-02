# gpt3-demo

## Bootstrap

Run the webserver locally to interact with the demo

### Open AI token required

Create one here: [https://openai.com/api/](https://openai.com/api/)

```sh
cp .env.local.example .env.local
```

Declare your API token in `.env.local`

### Starting the server

```sh
npm install
npm run dev
```

## Pre-commit setup
```sh
python3 -m pip install pre-commit
pre-commit --install
```
