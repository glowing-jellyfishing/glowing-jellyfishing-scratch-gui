const VERSION = 0;

let vm;

const postMessageToParent = message => {
    window.parent.postMessage(message, '*');
};

const handleMessage = data => {
    const type = data.type;
    switch (type) {
    case 'set':
    case 'get': {
        const name = data.name;
        const stage = vm.runtime.getTargetForStage();
        const variable = stage.lookupVariableByNameAndType(name, '');
        if (type === 'set') {
            variable.value = data.value;
            return {};
        }
        return {
            value: variable.value
        };
    }
    }
    throw new Error('Invalid message');
};

const onMessage = e => {
    const data = e.data;

    let response = {};
    try {
        response = {
            type: 'response',
            success: true,
            inResponseTo: data,
            ...handleMessage(data)
        };
    } catch (err) {
        response = {
            type: 'response',
            success: false,
            inResponseTo: data
        };
    }

    postMessageToParent(response);
};

const setupPostMessageAPI = _vm => {
    if (window.parent === window) {
        return;
    }
    vm = _vm;

    window.addEventListener('message', onMessage);

    vm.on('RUNTIME_STARTED', () => {
        postMessageToParent({
            type: 'start'
        });
    });
};

export default setupPostMessageAPI;
