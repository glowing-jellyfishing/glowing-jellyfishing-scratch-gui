import ScratchBlocks from 'scratch-blocks';

const isLoaded = () => true;

const get = () => ScratchBlocks;

const load = () => Promise.resolve();

export default {
    get,
    isLoaded,
    load
};
