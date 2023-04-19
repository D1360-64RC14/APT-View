import { StateElement } from './StateElement.js';

const validHeaderStates = ['intro', 'file-view'];
const headerState = StateElement.fromSelector('body[data-state]', validHeaderStates);
