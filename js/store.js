const Store = {
  files: [],

  add(entry) {
    this.files.push(entry);
  },

  remove(id) {
    this.files = this.files.filter((f) => f.id !== id);
  },

  getAll() {
    return this.files;
  },

  getPending() {
    return this.files.filter((f) => !f.convertedBlob);
  },

  getConverted() {
    return this.files.filter((f) => f.convertedBlob);
  },
};
