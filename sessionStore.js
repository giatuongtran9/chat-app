class SessionStore {
    findSession(id) {}
    saveSession(id, session) {}
    findAllSession() {}
}

class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.session = new Map();
    }

    findSession(id) {
        return this.session.get(id)
    }

    saveSession(id, session) {
        this.session.set(id, session);
    }

    findAllSession() {
        return [...this.session.values()]
    }
}

export default InMemorySessionStore