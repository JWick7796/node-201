const dao = require("../data/dao");

class Service {
	async getAllProducts() {
		try {
			return await dao.getAllProducts();
		} catch (error) {
			throw error;
		}
	}

	async getProductwithId(id) {
		try {
			return await dao.getProductwithId(id);
		} catch (error) {
			throw error;
		}
	}

	async addProduct(product) {
		try {
			return await dao.addProduct(product);
		} catch (error) {
			throw error;
		}
	}

	async updateProductWithId(product) {
		try {
			return await dao.updateProductWithId(product);
		} catch (error) {
			throw error;
		}
	}

	async deleteProductwithId(id) {
		try {
			return await dao.deleteProductwithId(id);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = new Service();
