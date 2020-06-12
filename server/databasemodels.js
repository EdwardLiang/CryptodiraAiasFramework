var mongoose = require("mongoose");
var levelSchema = new mongoose.Schema({
    user: String,
    name: String,
    dump: String
});

var levelModel = mongoose.model('Level', levelSchema);

module.exports = {
    levelModel: levelModel
}
