import { APTView } from './APTView/APTView.js';
import { SimpleCrawler } from './SimpleCrawler/SimpleCrawler.js';
import { StateElement } from './StateElement.js';

const historyInputElement = document.getElementById("history-file") as HTMLInputElement

const headerState = new StateElement(document.body)

const simpleCrawler = new SimpleCrawler();
const aptView = new APTView(simpleCrawler);

aptView.waitFileOnInput(historyInputElement)