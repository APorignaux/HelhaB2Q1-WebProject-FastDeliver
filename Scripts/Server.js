import expressModule from 'express';
import fsPromise from 'node:fs/promises';
import pathLibrary from 'path';

const app = expressModule();

app.use(expressModule.static('Source'));
app.listen(3010, () => {
  console.log('Server is running on port 3010');
});