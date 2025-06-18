import { z } from 'zod';

export const customAssetFormValidationSchema = ({ fields = [] }) => {
	if (!Array.isArray(fields) || fields.length === 0) {
		return z.object({});
	}

	const schema = fields.reduce((acc, field) => {
		let validator;
		const { keyType, label, isRequired, mappingKey } = field;

		switch (keyType) {
			case 'string':
				validator = z
					.string({
						required_error: `${label} is required`,
					})
					.trim();

				if (isRequired) {
					validator = validator.min(1, `${label} is required`);
				} else {
					validator = validator.optional();
				}
				break;

			case 'number':
				validator = z.coerce
					.number({
						required_error: `${label} is required`,
						invalid_type_error: `${label} must be a valid number`,
					})
					.refine(val => (isRequired ? val !== 0 && val !== '' : true), {
						message: `${label} is required`,
					});

				if (!isRequired) {
					validator = validator.optional();
				}
				break;

			case 'date':
				validator = z.preprocess(
					val => (val === '' || val === null || val === undefined ? undefined : new Date(val)),
					z.date({
						required_error: `${label} is required`,
						invalid_type_error: `${label} must be a valid date`,
					})
				);

				if (isRequired) {
					validator = validator.refine(value => value instanceof Date && !isNaN(value), {
						message: `${label} is required`,
					});
				} else {
					validator = validator.optional();
				}
				break;

			case 'boolean':
				validator = z.boolean();
				if (!isRequired) {
					validator = validator.optional();
				}
				break;

			default:
				validator = z.any();
				if (!isRequired) {
					validator = validator.optional();
				} else {
					validator = validator.refine(value => value !== undefined && value !== null && value !== '' && value !== 0, {
						message: `${label} is required`,
					});
				}
		}

		acc[mappingKey] = validator;
		return acc;
	}, {});

	return z.object(schema);
};
