import tsDirPromise from './tsDir';
import path from 'path';
const tsDir: string = path.resolve(__dirname, './tsDir');
const tsAddDir: string = path.resolve(__dirname, 'tsAddDir');
export default () => {
  describe('unit-test item', () => {
    function basketball () {
      return 'basketball';
    }
    let expectedTsDir: any = {
      deepModule: {
        basketball: {
          default: basketball
        },
        football: {
          mark: 'football after filter',
          default: {
            name: 'football'
          }
        },
        pingpong: {
          mark: 'ping-pong'
        }
      },
      LayerModule: {}
    }
    let basketballLayerPath = tsDir + '/basketball',
        footballLayerPath = tsDir + '/football',
        pingpongLayerPath = tsAddDir + '/pingpong';

    expectedTsDir.LayerModule[basketballLayerPath] = expectedTsDir.deepModule.basketball;
    expectedTsDir.LayerModule[footballLayerPath] = expectedTsDir.deepModule.football;
    expectedTsDir.LayerModule[pingpongLayerPath] = expectedTsDir.deepModule.pingpong;

    test('requireParseDirectory with ts Directory', () => {
      tsDirPromise.then((module:any) => {
        expect(module.deepModule.football).toEqual(expectedTsDir.deepModule.football);
        expect(module.deepModule.pingpong).toEqual(expectedTsDir.deepModule.pingpong);
        expect(module.deepModule.inter).toStrictEqual({});
        expect(JSON.stringify(module.deepModule.basketball)).toEqual(JSON.stringify(expectedTsDir.deepModule.basketball))
      })
    })
  })
}
