const { spawn } = require('child_process');

function getOutput(file, winners, cb) {
  const ls = spawn(
    'node',
    `./cli/index.js -p -d -s ${file} -w ${winners}`.split(' ')
  );
  let data = '';

  ls.stdout.on('data', dataPart => {
    if (!dataPart) return;

    data += dataPart;
  });

  ls.stderr.on('error', error => {
    cb(error);
  });

  ls.on('close', code => {
    // Remove time of execution
    cb(null, data.split('\n').slice(0, -2).join('\n'));
  });
}

describe('main func js', () => {
  test('it transform correctly', done => {
    getOutput('test/code/index.js', 'test/winners.json', (err, out) => {
      if (err) return done(err);
      expect(out).toMatchSnapshot();
      done();
    });
  });
});
