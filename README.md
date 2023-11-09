# Pm2Manager

A CLI to init PM2 config file for a whole folder. It will create a `ecosystem.config.js` file for the directory you want to manage.

The content of the file will be something like the below:

```js
module.exports = {
  "apps": [
    {
      "name": "app1",
      "cwd": "/path/to/app1",
      "script": "./pm2.start.sh"
    },
    {
      "name": "app2",
      "cwd": "/path/to/app2",
      "script": "./pm2.start.sh"
    },
  ]
}
```

So the default script is `pm2.start.sh` and you will need to create that file in each of your app folder in order for it to work.



## Installation

```bash
yarn global add pm2-manager
```

## Usage

```bash
pm2manager init [path]
```