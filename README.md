# Claps.dev

[![GitHub Actions](https://github.com/JounQin/Claps.dev/workflows/Node%20CI/badge.svg)](https://github.com/JounQin/Claps.dev/actions?query=workflow%3A%22Node+CI%22)
[![Codacy Grade](https://img.shields.io/codacy/grade/69305f19103744fea0de2395afa2271e)](https://www.codacy.com/app/JounQin/Claps.dev)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2FJounQin%2FClaps.dev%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![David](https://img.shields.io/david/JounQin/Claps.dev.svg)](https://david-dm.org/JounQin/Claps.dev)
[![David Dev](https://img.shields.io/david/dev/JounQin/Claps.dev.svg)](https://david-dm.org/JounQin/Claps.dev?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codechecks.io](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)

> Help you funding the creators and projects you appreciate with crypto currencies.

## How to run

### Setup Database

Create MySQL database according to `server/database.sql`

### Create a Mixin bot

1. Visit https://mixin.one, install and download Mixin Messenger
2. Visit https://developers.mixin.one/dashboard, create a new bot, fill the bot info
3. Copy `client ID`(应用 ID), generate `client secret`(应用密钥) and the `keystore json file`(应用 Session) at "密钥"

### Create a Github OAuth App

1. Visit https://github.com/settings/developers and create a new Github OAuth App
2. Visit https://github.com/settings/tokens and create a new personal token for development

### Config 

1. Create a file named `.env.local`
2. Required environment variables:

  ```sh
  GITHUB_CLIENT_ID=YOUR_GITHUB_OAUTH_APP_CLIENT_ID
  GITHUB_CLIENT_SECRET=YOUR_GITHUB_OAUTH_APP_CLIENT_SECRET
  GITHUB_CLIENT_TOKEN=YOUR_GITHUB_OAUTH_APP_CLIENT_TOKEN
  GITHUB_OAUTH_CALLBACK=YOUR_GITHUB_OAUTH_CALLBACK

  MIXIN_CLIENT_ID=YOUR_MIXIN_BOT_CLIENT_ID
  MIXIN_CLIENT_CONFIG=PATH_OF_KEYSTORE_FILE
  MIXIN_CLIENT_SECRET=YOUR_MIXIN_BOT_CLIENT_SECRET

  DATABASE_CONFIG={"host": "", "port": "3306", "username": "", "password": "", "database": ""}
  ```

### Run

1. run `yarn`
2. run `yarn dev`

### Add projects, repos, users, etc

1. Create project, repositories, users and members manually into database
2. Create wallet bots with `yarn exec-ts scripts/create-bots {projectId}`

### Deployment

**Approach 1: Use `pm2`**

1. Install [`pm2`](https://github.com/Unitech/pm2) globally: `yarn global add pm2`
2. Build assets: `yarn build`
3. Run server in background: `pm2 start --name Claps.dev npm -- start`

**Approach 2: Use `systemd`**

1. Write a shell script at `/PATH/TO/CLAPS/start.sh`:
    ```sh
    #!/usr/bin/env bash
    # comment the line if you do not use nvm
    . /home/YOUR_NAME/.nvm/nvm.sh
    yarn start
    ```

2. Write a systemd service file at `/etc/systemd/system/claps.service`:
    ```sh
    [Unit]
    Description=Claps Service
    After=network.target
    After=systemd-user-sessions.service
    After=network-online.target

    [Service]
    ExecStart=/PATH/TO/CLAPS/start.sh
    WorkingDirectory=/home/ubuntu/claps
    Type=simple
    User=ubuntu
    Group=ubuntu
    Restart=always
    RestartSec=1s
    StartLimitIntervalSec=10
    StartLimitBurst=10

    [Install]
    WantedBy=multi-user.target
    ```
3. Enable claps service: `sudo systemctl enable claps.service`
4. Start claps service: `sudo systemctl start claps.service`
