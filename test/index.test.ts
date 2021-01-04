  const jsDirPromise = require('./jsDir');
  describe('unit-test', () => {
    function basketball () {
      return 'basketball';
    }
    test('requireParseDirectory with js Directory', () => {
      jsDirPromise.then((msg:any) => {
        expect(JSON.stringify(msg)).toEqual(JSON.stringify({
          deepModule: {
            basketball: {default: basketball},
            football: {
              mark: 'football',
              default: {
                mark: 'football'
              }
            }
          },
          LayerModule: {
            "/basketball": {default: basketball},
            "/football": {
              mark: 'football',
              default: {
                mark: 'football'
              }
            }
          }
        }))
      })
    })
  })
