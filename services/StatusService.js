class StatusService {
    constructor(db) {
        this.Status = db.Status
    }

    async getAllStatuses() {
        return this.Status.findAll({
            where: {}
        })
    }
}

module.exports = StatusService;