const { Schema, model } = require('mongoose');

const HospitalSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { collection: 'hospitals' }
);

HospitalSchema.method('toJSON', function () {
  const { __v,_id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('Hospital', HospitalSchema);
