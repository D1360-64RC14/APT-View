import { AttributeObserver } from './AttributeObserver.js';
import { FileSelector } from './FileSelector.js';
import { StateElement } from './StateElement.js';

const validHeaderStates = ['intro', 'file-view'];
const validFormStates = ['waiting-file', 'file-selected', 'analyzing', 'error'];

const headerState = StateElement.fromSelector('body[data-state]', validHeaderStates);
const formState = StateElement.fromSelector('body main form[data-state]', validFormStates);

const formAttObserver = new AttributeObserver(formState.rootElement);

formAttObserver.observe(console.log);

const fileSelector = new FileSelector('form.fileSelector');
