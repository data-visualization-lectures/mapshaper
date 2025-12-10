import { nodeResolve } from '@rollup/plugin-node-resolve';

const onBundle = {
  name: 'onbundle',
  writeBundle() {
    // copy mapshaper.js to www/
    const fs = require('fs');
    const path = require('path');
    const src = path.join(__dirname, 'mapshaper.js');
    // Ensure www/js exists just in case (though it should)
    // Existing config copied to www/mapshaper.js, but index.html references js/mapshaper.js
    // I will preserve existing behavior for mapshaper.js to avoid scope creep/risk, 
    // BUT I will copy the new files to www/js/ as planned.
    const dest = path.join(__dirname, 'www/mapshaper.js');
    fs.writeFileSync(dest, fs.readFileSync(src));

    // Copy auth libs to www/js/
    const libSrc = path.join(__dirname, 'src/lib');
    const jsDest = path.join(__dirname, 'www/js');

    fs.copyFileSync(path.join(libSrc, 'supabase.js'), path.join(jsDest, 'supabase.js'));
    fs.copyFileSync(path.join(libSrc, 'dataviz-auth-client.js'), path.join(jsDest, 'dataviz-auth-client.js'));
  }
};

export default [{
  treeshake: false,
  input: 'src/gui/gui.mjs',
  output: [{
    strict: false,
    format: 'iife',
    file: 'www/mapshaper-gui.js'
  }]
}, {
  treeshake: true,
  context: 'null', // prevent a Rollup warning from msgpack
  input: 'src/mapshaper.mjs',
  output: [{
    strict: false,
    format: 'iife',
    file: 'mapshaper.js',
    intro: 'var VERSION = "' + require('./package.json').version + '";\n'
  }],
  plugins: [onBundle, nodeResolve()]
}];
