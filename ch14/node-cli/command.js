#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const htmlTemplate = 
`<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <title>Template</title>
</head>
<body>
  <h1>Hello</h1>
  <p>CLI</p>
</body>
</html>
`;

const routerTemplate = 
`
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.send('ok');
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
`;

const exists = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const mkdirp = (dir) => {
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx+1).join(path.sep);
    if(!exists(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeTemplate = (type, name, directory) => {
  mkdirp(directory);
  if(type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);
    if(exists(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다');
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(pathToFile, '생성 완료');
    }
  } else if(type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);
    if(exists(pathToFile)) {
      console.error('이미 해당 파일이 존재합니다');
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, '생성 완료');
    }
  } else {
    console.error('html 도는 express-router 둘 중 하나를 입력하세요');
  }
};


let triggered = false;

program
  .version('0.0.1', '-v, --version')  // 프로그램 버전 설정
  .usage('[options]');  // 명령어 사용법 설정

program
  .command('template <type>')
  .usage('--name <name> --path [path]')
  .description('템플릿을 생성합니다')  // 명령어에 대한 설명을 설정
  .alias('tmpl')  // 명령어의 별칭 설정
  .option('-n, --name <name>', '파일명을 입력하세요', 'index')  // 명령어에 대한 부가적인 옵션 설정
  .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
  .action((type, options) => {  // 명령어에 대한 실제 동작을 정의
    // console.log(type, options.name, options.directory);
    makeTemplate(type, options.name, options.directory);
    triggered = true;
  });

program
  .command('*', { noHelp: true })
  .action(() => {
    console.log('해당 명령어를 찾을 수 없습니다');
    program.help();  // 설명서를 보여주는 옵션
    triggered = true;
  });

// program 객체의 마지막에 붙이는 메소드
// process.argv를 인자로 받아서 명령어와 옵션을 파싱
program
  .parse(process.argv);

if(!triggered) {
  inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: '템플릿 종류를 선택하세요',
    choices: ['html', 'express-router'],
  }, {
    type: 'input',
    name: 'name',
    message: '파일의 이름을 입력하세요',
    default: 'index',
  }, {
    type: 'input',
    name: 'directory',
    message: '파일이 위치할 폴더의 경로를 입력하세요',
    default: '.'
  }, {
    type: 'confirm',
    name: 'confirm',
    message: '생성하시겠습니까?',
  }])
    .then((answers) => {
      if(answers.confirm) {
        makeTemplate(answers.type, answers.name, answers.directory);
      }
    });
}