import requireDirectoryAsync from '../../index';
export default requireDirectoryAsync(module, {
  addPath: ['../tsAddDir'],
  filter (module:any) {
    module.deepModule.football.mark = 'football after filter';
    return module;
  },
  recurse: false
});