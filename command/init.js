'use strict';
const exec = require('child_process').exec;
const co = require('co');
const prompt = require('co-prompt');
const config = require('../templates');
const chalk = require('chalk');

module.exports = () => {
  co(function *() {
    // 处理用户输入
    let tplName = 'base',
    projectName = yield prompt('Project name: '),
    gitUrl,
    branch;

    if (!config.tpl[tplName]) {
      console.log(chalk.red('\n × Template does not exit!'));
      process.exit()
    }
    gitUrl = config.tpl[tplName].url;
    branch = config.tpl[tplName].branch;

    // git命令，远程拉取项目并自定义项目名
    let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`;

    console.log(chalk.white('\n Start generating...'));

    let workerProcess = exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        process.exit()
      }
      console.log(chalk.green('\n √ Generation completed!'),`\n Please \n cd ${projectName} && npm install \n`);
      process.exit()
    })

    workerProcess.stdout.on('data', function (message) {
      // console.log(message);
    });

    workerProcess.stderr.on('data', function (err) {
      // console.log(err);
    });
  })
};
