const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String,  required: true },
    fullName: { type: String,  required: true },
    email: { type: String,  required: true, unique: true },
    password: { type: String,  required: true },
    profileImageUrl: { type: String,  required: null },
    bookmarkedPolls: { type: mongoose.Schema.Types.ObjectId,  ref: "Poll", default: [] },
 }, { timestamps: true });

//Hash password before saving
UserSchema.pre('save', async function (next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);