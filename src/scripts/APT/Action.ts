import { Package } from "./Package.js";

export interface Action {
    name: string;
    packages: Package[];
}