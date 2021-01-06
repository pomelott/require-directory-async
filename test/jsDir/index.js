const requireDirectoryAsync = require('../../index.js');
module.exports = requireDirectoryAsync(module, {
  addPath: ['../jsAddDir'],
  filter (module) {
    module.deepModule.football.mark = 'football after filter';
    return module;
  }
});