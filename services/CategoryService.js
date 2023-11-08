class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async getOne(id, userId) {
        return this.Category.findOne({
            where: { id, UserId: userId }
        });
    }

    async getAll(userId) {
        return this.Category.findAll({
            where: { UserId: userId }
        });
    }

    async create(name, UserId, userId) {
        return this.Category.create({
            name,
            UserId
        }, {
            where: { UserId: userId }
        });
    }

    async update(id, userId, name) {
    return this.Category.update({
            name
        }, {
            where: { id, UserId: userId }
        });
    }

    async delete(id) {
        return this.Category.destroy({
            where: { id }
        });
    }
}

module.exports = CategoryService;