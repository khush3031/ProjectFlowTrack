import mongoose from 'mongoose'
const { Schema } = mongoose

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'ISSUE_CREATED',
        'ISSUE_UPDATED',
        'ISSUE_DELETED',
        'STATUS_CHANGED',
        'PRIORITY_CHANGED',
        'ASSIGNEE_CHANGED',
        'DUE_DATE_CHANGED',
        'TITLE_CHANGED',
        'DESCRIPTION_CHANGED',
        'COMMENT_ADDED',
        'COMMENT_EDITED',
        'COMMENT_DELETED',
      ],
    },
    previousValue: {
      type: String,
      default: null,
    },
    newValue: {
      type: String,
      default: null,
    },
    field: {
      type: String,
      default: null,
    },
    issue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      index: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

activityLogSchema.index({ issue: 1, createdAt: -1 })
activityLogSchema.index({ project: 1, createdAt: -1 })
activityLogSchema.index({ changedBy: 1, createdAt: -1 })

export default mongoose.model('ActivityLog', activityLogSchema)
