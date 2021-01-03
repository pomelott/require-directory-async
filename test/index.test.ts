import { exec } from "child_process"


  function sum(a:any, b:any) {
    return a + b;
  }
  describe('', () => {
    test('test', () => {
      expect(sum(1,2)).toBe(3)
    })
  })
