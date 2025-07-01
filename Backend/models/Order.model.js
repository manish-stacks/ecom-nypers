const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            size: { type: String, required: true },
            color: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            _id: false,
        },
    ],
    isDeliveryFeePay: {
        type: Boolean,
        default: false
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    payAmt: {
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
    },
    transactionId: { type: String },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
    },
    shipping: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postCode: { type: String, required: true },
        mobileNumber: { type: String, required: true },
    },

    totalquantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'progress'],
        default: 'pending',
    },

    orderDate: {
        type: Date,
        default: Date.now,
    },
    estimatedDeliveryDate: {
        type: Date,
    },
    OrderProcessRating: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
