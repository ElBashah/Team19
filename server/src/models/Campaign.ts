import mongoose, { Schema } from "mongoose";
import uuid from 'uuid';
const ResponseSchema: Schema = new Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

export const MessageSchema: Schema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: uuid()
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  responses: [{
    type: ResponseSchema
  }],
  status: {
    type: String,
    default: 'pending',
    required: true,
    enum: ['pending', 'started', 'complete']
  }
});

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: {
      validator: function(email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
      },
      message: () => `Invalid email`
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function(phone: string) {
        const phoneRegex = /\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
      },
      message: () => `Invalid phone number format`
    }
  }
})

const CampaignSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  messages: [{
    type: MessageSchema
  }],
  users: [{
    type: UserSchema
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  complete: {
    type: Boolean,
    required: true,
    default: false
  }
});

CampaignSchema.query.addMessageResponse = function(campaign_id: string, message_uuid: string, user_identifier: string, text: string){
  return this.findOneAndUpdate({_id: campaign_id}, { $push: { messages: {
    user: user_identifier,
    text,
    date: Date.now()
  } }});
}

export const Campaign = mongoose.model('Campaign', CampaignSchema)
