export default [
  {
    input: 'src/lib.js',
    output: [      {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    }, {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    }],
  }
];

