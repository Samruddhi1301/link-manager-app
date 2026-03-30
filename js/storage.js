const Storage = {
    DB_NAME: 'link_manager_v3', // Incremented version to ensure fresh start
    save(data) {
        localStorage.setItem(this.DB_NAME, JSON.stringify(data));
    },
    fetch() {
        const data = localStorage.getItem(this.DB_NAME);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
};