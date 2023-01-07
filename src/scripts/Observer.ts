type ObserverFunction<E> = (event: E) => void;

export class Observer<E> {
    private callbacks: ObserverFunction<E>[] = [];

    emit(event: E) {
        for (const cb of this.callbacks) {
            cb(event);
        }
    }

    observe(callback: ObserverFunction<E>) {
        this.callbacks.push(callback);
    }

    remove(callback: ObserverFunction<E>) {
        const cbIndex = this.callbacks.indexOf(callback);

        if (cbIndex === -1) return false;

        this.callbacks.splice(cbIndex);
        return true;
    }

    clear() {
        const { length } = this.callbacks;
        this.callbacks = [];

        return length;
    }
}