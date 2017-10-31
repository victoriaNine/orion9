import copy from 'copy';

console.log("-- Copying custom node modules");
copy('custom_modules/**/*', 'node_modules', (err, file) => { // eslint-disable-line no-unused-vars
  if (err) {
    console.error(err);
  } else {
    console.log("-- Copy completed");
  }
});
