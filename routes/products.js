const express = require("express");
const router = express.Router();
const service = require("../service/service");
const Response = require("../models/Response");
const errors = require("../errors/errors");
const ProductDoesNotExistError = errors.ProductDoesNotExistError;
const NoProductsExistError = errors.NoProductsExistError;
const ProductAlreadyExistsError = errors.ProductAlreadyExistsError;
const InvalidProductDataError = errors.InvalidProductDataError;

router.get("/", async (req, res) => {
	try {
		const data = await service.getAllProducts();
		res.status(200).send(
			new Response(
				200,
				"Success",
				"Fetched All Products Successfully",
				data
			)
		);
	} catch (error) {
		if (error instanceof NoProductsExistError) {
			res.status(400).send(
				new Response(400, "Failure", error.message, null)
			);
		} else {
			res.status(500).send(
				new Response(500, "Failure", error.message, null)
			);
		}
	}
});

router.get("/:id", async (req, res) => {
	try {
		const data = await service.getProductwithId(req.params.id);
		res.status(200).send(
			new Response(200, "Success", "Fetched Product Successfully", data)
		);
	} catch (error) {
		if (error instanceof ProductDoesNotExistError) {
			res.status(400).send(
				new Response(400, "Failure", error.message, null)
			);
		} else {
			res.status(500).send(
				new Response(500, "Failure", error.message, null)
			);
		}
	}
});

router.post("/", async (req, res) => {
	try {
		const data = await service.addProduct(req.body);
		res.status(200).send(
			new Response(200, "Success", "Added The Product Successfully", data)
		);
	} catch (error) {
		if (
			error instanceof ProductAlreadyExistsError ||
			error instanceof InvalidProductDataError
		) {
			res.status(400).send(
				new Response(400, "Failure", error.message, null)
			);
		} else {
			res.status(500).send(
				new Response(500, "Failure", error.message, null)
			);
		}
	}
});

router.put("/", async (req, res) => {
	try {
		const data = await service.updateProductWithId(req.body);
		res.status(200).send(
			new Response(
				200,
				"Success",
				"Updated The Product Successfully",
				data
			)
		);
	} catch (error) {
		if (
			error instanceof ProductDoesNotExistError ||
			error instanceof InvalidProductDataError
		) {
			res.status(400).send(
				new Response(400, "Failure", error.message, null)
			);
		} else {
			res.status(500).send(
				new Response(500, "Failure", error.message, null)
			);
		}
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const data = await service.deleteProductwithId(req.params.id);
		res.status(200).send(
			new Response(
				200,
				"Success",
				"Deleted The Product Successfully",
				data
			)
		);
	} catch (error) {
		if (error instanceof ProductDoesNotExistError) {
			res.status(400).send(
				new Response(400, "Failure", error.message, null)
			);
		} else {
			res.status(500).send(
				new Response(500, "Failure", error.message, null)
			);
		}
	}
});

module.exports = router;
