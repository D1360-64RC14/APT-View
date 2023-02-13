export class MapTools {
    static incrementValueFrom<K>(map: Map<K, number>, key: K, quantity = 1) {
        const currValue = map.get(key);
        const keyIsDefined = currValue !== undefined;

        if (keyIsDefined) {
            map.set(key, currValue + quantity);
        } else {
            map.set(key, quantity);
        }
    }
}