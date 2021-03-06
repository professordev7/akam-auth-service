import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

interface IUser {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		group: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Group',
		},
		provider: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);

export const validateLoginUser = (user: IUser) => {
	const schema = Joi.object({
		email: Joi.string().min(8).max(255).email().required(),
		password: Joi.string().min(5).max(1024).required(),
	});

	return schema.validate(user);
};

export const generateToken = (id: string) => {
	return jwt.sign({ _id: id }, process.env.JWT_SECRET as string, {
		expiresIn: '30d',
	});
};
