export type EventObserverCallback<E> = (event: E) => void;

export class EventObserver<E> {
    private callbacks = new Set<EventObserverCallback<E>>;

    // Emits an data event to the observer
    emit(event: E) {
        for (const cb of this.callbacks) {
            cb(event);
        }
    }

    // Observe/Subscribe to/Listen to events
    observe(callback: EventObserverCallback<E>) {
        this.callbacks.add(callback);
    }

    // Observe/Subscribe to/Listen to events only once
    observeOnce(callback: EventObserverCallback<E>) {
        const onceFunction = (event: E) => {
            callback(event);
            this.callbacks.delete(onceFunction);
        };

        this.callbacks.add(onceFunction);
    }

    // Stop receiving events from this observer
    remove(callback: EventObserverCallback<E>) {
        return this.callbacks.delete(callback);
    }

    // Remove all observers
    clearObservers() {
        const { size } = this.callbacks;
        this.callbacks.clear();

        return size;
    }
}