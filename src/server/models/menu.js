var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;

var MenuSchema = new Schema({
  key: { type: String },
  value: { type: String },
  deleted: {type: Boolean, default: false},
  enable: {type: Boolean, default: false},
  create_at: { type: Date, default: Date.now },
});
MenuSchema.plugin(BaseModel);
MenuSchema.index({create_at: -1});

mongoose.model('Menu', MenuSchema);