const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const User = new mongoose.Schema({ 
    name: {type: String},
    email: {type: String},
});

const Comment = new mongoose.Schema({ 
    userInfo: User,
    parentId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
        default: null 
    },
    childCommentIds: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comments'
    }],
    content: { type: String },
    posted: {type: Date, default: Date.now},
    commentNumberReply: {type: Number, default: 0},
},{
    timestamps: true,
});
Comment.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Comments = mongoose.model('Comments', Comment);
module.exports = Comments
