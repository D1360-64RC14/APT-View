import { FileSelector } from './FileSelector/FileSelector.js';
import { StateElement } from './StateElement.js';

const validHeaderStates = ['intro', 'file-view'];
const headerState = StateElement.fromSelector('body[data-state]', validHeaderStates);

const fileSelector = FileSelector.fromSelector('form.fileSelector');
