import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';


export default [{
  input: 'index.ts',
  external: ['path', 'fs', 'lodash'],
  output: {
    file: "index.js",
    format: 'cjs',
    exports: 'default'
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript()
  ]
}]