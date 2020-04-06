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

## Deployment

1. Create MySQL database according to `server/database.sql`
2. Create a file named `.env.local`
3. Required environment variables:

   ```sh
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   GITHUB_CLIENT_TOKEN=
   GITHUB_OAUTH_CALLBACK=
   
   MIXIN_CLIENT_ID=
   MIXIN_CLIENT_CONFIG= # json config
   MIXIN_CLIENT_SECRET=
   
   DATABASE_CONFIG= # json config with `host`, `port`, `username`, `password` and `database`
   ```

4. Install [`pm2`](https://github.com/Unitech/pm2) globally: `yarn global add pm2`
5. Build assets: `yarn build`
6. Run server in background: `pm2 start --name Claps.dev npm -- start`
7. Create project, repositories, users and members manually into database
8. Create wallet bots with `yarn exec-ts scripts/create-bots {projectId}`
