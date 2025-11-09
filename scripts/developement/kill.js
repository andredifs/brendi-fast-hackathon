const kill = require('kill-port');

const firebaseConfig = {
    emulators: {
        firestore: {
            port: 9093,
            host: '0.0.0.0'
        },
        functions: {
            port: 5001,
            host: '0.0.0.0'
        }
    }
}

const ports = Object.values(firebaseConfig.emulators)
    .filter(option => option.port)
    .map(option => option.port);

(async () => {
    const results = await Promise.allSettled(ports.map(port => kill(port, 'tcp')));

    const killedPorts = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    if (killedPorts.length === 0) {
        console.log('Emulators not running yet.');

        return;
    }

    console.log(`Number of killed ports: ${killedPorts.length}`);
})();
