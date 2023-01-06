import { FileSelector } from './FileSelector.js';
import { StateElement } from './StateElement.js';

const headerState = StateElement.fromSelector(
    'body[data-state]',
    ['intro', 'file-view']
);
const formState = StateElement.fromSelector(
    'body main form[data-state]',
    ['waiting-file', 'file-selected', 'analyzing', 'error']
);

const fileSelector = new FileSelector('form.fileSelector');
