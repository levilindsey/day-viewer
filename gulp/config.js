var config = {};

config.srcPath = 'src';
config.distPath = 'dist';
config.resPath = 'res';
config.bowerPath = 'bower_components';

config.publicPath = config.srcPath + '/public';
config.serverPath = '../' + config.srcPath + '/server';

config.scriptsDist = config.distPath + '/scripts';
config.stylesDist = config.distPath + '/styles';
config.imageDist = config.distPath + '/images';

config.serverMainPath = config.serverPath + '/main';

config.karmaConfigPath = config.srcPath + '/karma.conf.js';

config.scriptDistFileName = 'day-viewer.js';

config.distGlob = config.distPath + '/**';

config.scriptsDistFilePath = config.scriptsDist + '/' + config.scriptDistFileName;
config.frontEndTestsSrc = config.publicPath + '/**/*_test.js';
config.backEndTestsSrc = config.serverPath + '/**/*_test.js';

config.allFilesForFrontEndTests = [
  config.bowerPath + '/angular-mocks/angular-mocks.js',
  config.scriptsDistFilePath,
  config.frontEndTestsSrc
];

config.indexSrc = config.publicPath + '/index.html';

config.scriptsSrc = [
  config.publicPath + '/**/*.js',
  '!' + config.frontEndTestsSrc,
  '!' + config.backEndTestsSrc
];
config.stylesPartialsSrc = config.publicPath + '/**/_*.scss';
config.stylesMainSrc = config.publicPath + '/main.scss';
config.stylesSrc = config.publicPath + '/**/*.scss';
config.imagesSrc = config.resPath + '/images/**/*.+(png|jpg|gif)';
config.mediaSrc = [config.resPath + '/**', '!' + config.imagesSrc];
config.iconsSrc = config.resPath + '/images/icons/*.svg';
config.deviceIconsSrc = config.resPath + '/images/device-icons/*';

config.buildTasks = [
  'scripts',
  'styles',
  'index',
  'copy-device-icons'
];

config.host = '0.0.0.0';
config.port = 3000;

module.exports = config;
