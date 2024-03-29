import commonjs from 'rollup-plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';


export default {
  input: 'index.js',
  output: {
    dir: 'output',
    format: 'system'
  },
  plugins: [nodeResolve(), commonjs()]
};
