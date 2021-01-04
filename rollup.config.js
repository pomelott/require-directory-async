import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';


export default [{
  input: 'index.ts',
  external: ['path', 'fs'],
  output: {
    file: "index.js",
    format: 'cjs',
    exports: 'named'
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript()
  ]
}]