const jsDirPromise = require('./jsDir');
import path from 'path';
const jsDir: string = path.resolve(__dirname, './jsDir');
const jsADddDir: string = path.resolve(__dirname, './jsAddDir');

export default () => {
  describe('unit-test item', () => {
    function basketball () {
      return 'basketball';
    }
    let expectedJsDir: any = {
      deepModule: {
        inter: {
          tennis: {
            mark: 'tennis'
          }
        },
        basketball: basketball,
        pingpong: {
          mark: 'ping-pong'
        },
        football: {
          mark: 'football after filter'
        }
      },
      layerModule: {}
    }
    let basketballLayerPath = jsDir + '/basketball',
        footballLayerPath = jsDir + '/football',
        tennisLayerPath = jsDir + '/inter/tennis',
        pingpongLayerPath = jsADddDir + '/pingpong';

    expectedJsDir.layerModule[basketballLayerPath] = expectedJsDir.deepModule.basketball;
    expectedJsDir.layerModule[footballLayerPath] = expectedJsDir.deepModule.football;
    expectedJsDir.layerModule[tennisLayerPath] = expectedJsDir.deepModule.inter.tennis;
    expectedJsDir.layerModule[pingpongLayerPath] = expectedJsDir.deepModule.pingpong;
    test('requireParseDirectory with js Directory', () => {
      jsDirPromise.then((module:any) => {
        expect(module.deepModule.inter).toEqual(expectedJsDir.deepModule.inter);
        expect(module.deepModule.pingpong).toEqual(expectedJsDir.deepModule.pingpong);
        expect(module.deepModule.football).toEqual(expectedJsDir.deepModule.football);
        expect(JSON.stringify(module.deepModule.basketball)).toEqual(JSON.stringify(expectedJsDir.deepModule.basketball));

        expect(module.layerModule[footballLayerPath]).toEqual(expectedJsDir.layerModule[footballLayerPath])
        expect(module.layerModule[tennisLayerPath]).toEqual(expectedJsDir.layerModule[tennisLayerPath])
        expect(module.layerModule[pingpongLayerPath]).toEqual(expectedJsDir.layerModule[pingpongLayerPath])
        expect(JSON.stringify(module.layerModule[basketballLayerPath])).toEqual(JSON.stringify(expectedJsDir.layerModule[basketballLayerPath]));
      })
    })
  })
}
