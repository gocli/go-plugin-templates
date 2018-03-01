import babel from 'rollup-plugin-babel'
import standard from 'rollup-plugin-standard'

export default {
  input: 'src/plugin.js',
  output: {
    file: 'dist/plugin.js',
    format: 'cjs',
    sourcemap: true
  },
  external: [],
  plugins: [
    standard(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
