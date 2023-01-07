type EventObserverCallback<E> = (event: E) => void;

export class EventObserver<E> {
    private callbacks: EventObserverCallback<E>[] = [];

    // Emits an data event to the observer
    emit(event: E) {
        for (const cb of this.callbacks) {
            cb(event);
        }
    }

    // Observe/Subscribe to/Listen to events
    observe(callback: EventObserverCallback<E>) {
        this.callbacks.push(callback);
    }

    // Stop receiving events from this observer
    remove(callback: EventObserverCallback<E>) {
        const cbIndex = this.callbacks.indexOf(callback);

        if (cbIndex === -1) return false;

        this.callbacks.splice(cbIndex);
        return true;
    }

    // Remove all observers
    clearObservers() {
        const { length } = this.callbacks;
        this.callbacks = [];

        return length;
    }
}