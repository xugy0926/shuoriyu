var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var SubmenuSchema = new Schema({
  parent_id: { type: ObjectId },
  key: { type: String },
  value: { type: String },
  deleted: {type: Boolean, default: false},
  enable: {type: Boolean, default: false},
  create_at: { type: Date, default: Date.now }
});
SubmenuSchema.plugin(BaseModel);
SubmenuSchema.index({create_at: -1});

mongoose.model('Submenu', SubmenuSchema);
