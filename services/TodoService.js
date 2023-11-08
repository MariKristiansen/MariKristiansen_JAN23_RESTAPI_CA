class TodoService {
    constructor(db) {
        this.client = db.sequelize;
        this.Todo = db.Todo;
    }

    async getOne(id, userId) {
        return this.Todo.findOne({
            where: { id, UserId: userId }
        });
    }

    async getAll(userId) {
        return this.Todo.findAll({
            where: { UserId: userId }
        });
    }

    async create(userId, name, description, CategoryId, StatusId, UserId) {
        return this.Todo.create({
            name,
            description,
            CategoryId,
            StatusId,
            UserId
        }, {
            where: { UserId: userId }
        });
    }

    async update(id, userId, name, description, CategoryId, StatusId, UserId) {
        return this.Todo.update({
            name,
            description,
            CategoryId,
            StatusId,
            UserId
        }, {
            where: { id, UserId: userId }
        });
    }

    async delete(id, StatusId) {
        return this.Todo.update({
            StatusId
        }, {
            where: { id }
        });
    }
}

module.exports = TodoService;