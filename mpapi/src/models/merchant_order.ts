import { Schema, model, Document } from "mongoose";

/**
 * {
  "id": 9999999999,
  "status": "closed",
  "external_reference": "default",
  "preference_id": "Preference identification",
  "payments": [
    {
      "id": 9999999999,
      "transaction_amount": 1,
      "total_paid_amount": 1,
      "shipping_cost": 0,
      "currency_id": "BRL",
      "status": "approved",
      "status_detail": "accredited",
      "date_approved": "2019-04-02T18:35:35.000Z",
      "date_created": "2019-04-02T18:35:34.000Z",
      "last_modified": "2019-04-02T18:35:35.000Z",
      "amount_refunded": 0
    }
  ],
  "shipments": [
    {
      "id": 99999999999,
      "shipment_type": "shipping",
      "shipping_mode": "me2",
      "status": "delivered",
      "items": [
        {
          "id": "not specified",
          "description": "shipment item description",
          "quantity": 1,
          "dimensions": "1.0x10.0x23.0100.0"
        }
      ],
      "date_created": "2019-04-02T18:20:46.000Z",
      "last_modified": "2019-04-12T19:36:48.000Z",
      "date_first_printed": "2019-04-02T18:35:40.000Z",
      "service_id": 999,
      "sender_id": 999999999,
      "receiver_id": 999999999,
      "receiver_address": {
        "id": 9999999999,
        "address_line": "address line",
        "city": {
          "name": "City Name"
        },
        "state": {
          "id": "AR-X",
          "name": "state name"
        },
        "country": {
          "id": "AR",
          "name": "Argentina"
        },
        "latitude": 0,
        "longitude": 0,
        "comment": "shipment comment",
        "contact": "shipment contact",
        "phone": 9999999999,
        "zip_code": 9999,
        "street_name": "Nombre de la calle",
        "street_number": 999
      },
      "shipping_option": {
        "id": 999999999,
        "cost": 0,
        "currency_id": "BRL",
        "shipping_method_id": 99999,
        "estimated_delivery": {
          "date": "2019-04-11T03:00:00.000Z"
        },
        "name": "Normal a domicilio",
        "list_cost": 0,
        "speed": {
          "handling": 72,
          "shipping": 72
        }
      }
    }
  ],
  "payouts": {},
  "collector": {
    "id": 999999999,
    "email": "vendedor+329653108@adf12.com.br",
    "nickname": "TESTRPEHE21Q"
  },
  "marketplace": "NONE",
  "date_created": "2018-09-14T17:11:31.000Z",
  "last_updated": "2018-09-14T17:11:43.000Z",
  "shipping_cost": 0,
  "total_amount": 5,
  "site_id": "mla",
  "paid_amount": 5,
  "refunded_amount": 0,
  "payer": {
    "id": 999999999
  },
  "items": [
    {
      "id": "item id",
      "category_id": "item category",
      "currency_id": "BRL",
      "description": "item description",
      "picture_url": "item picture url",
      "title": "item title",
      "quantity": 1,
      "unit_price": 5
    }
  ],
  "cancelled": false,
  "additional_info": "additional information",
  "application_id": 10000000000000000,
  "order_status": "paid"
}
 */
export interface Imertchant_order extends Document {
  id: number;
  status: string;
  external_reference: string;
  preference_id: string;
  payments: [
    //{
    //  transaction_amount: number;
    //  total_paid_amount: number;
    //  shipping_cost: number;
    //  currency_id: string;
    //  status: string;
    //  status_detail: string;
    //  date_approved: string;
    //  date_created: string;
    //  last_modified: string;
    //  amount_refunded: number;
    //}
  ];
  shipments: [
    //{
    //  id: number;
    //  shipment_type: string;
    //  shipping_mode: string;
    //  status: string;
    //  items: [
    //    {
    //      id: string;
    //      description: string;
    //      quantity: number;
    //      dimensions: string;
    //    }
    //  ],
    //  date_created: string;
    //  last_modified: string;
    //  date_first_printed: string;
    //  service_id: number;
    //  sender_id: number;
    //  receiver_id: number;
    //  receiver_address: {
    //    id: number;
    //    address_line: string;
    //    city: {
    //      name: string;
    //    },
    //    state: {
    //      id: string;
    //      name: string;
    //    },
    //    country: {
    //      id: string;
    //      name: string;
    //    },
    //    latitude: number;
    //    longitude: number;
    //    comment: string;
    //    contact: string;
    //    phone: number;
    //    zip_code: number;
    //    street_name: string;
    //    street_number: number;
    //  },
    //  shipping_option: {
    //    id: number;
    //    cost: number;
    //    currency_id: string;
    //    shipping_method_id: number;
    //    estimated_delivery: {
    //      date: string;
    //    },
    //    name: string;
    //    list_cost: number;
    //    speed: {
    //      handling: number;
    //      shipping: number;
    //    }
    //  }
    //}
  ],
  payouts: {},
  collector: {
    /*
    id: number;
    email: string;
    nickname: string;
    */
  },
  marketplace: string;
  date_created: string;
  last_updated: string;
  shipping_cost: number;
  total_amount: number;
  site_id: string;
  paid_amount: number;
  refunded_amount: number;
  payer: {
    //id: number;
  },
  items: [
    //{
    //  id: string;
    //  category_id: string;
    //  currency_id: string;
    //  description: string;
    //  picture_url: string;
    //  title: string;
    //  quantity: number;
    //  unit_price: number;
    //}
  ],
  cancelled: boolean;
  additional_info: string;
  application_id: number;
  order_status: string;
};

const mertchant_orderSchema = new Schema({
  topic: { type: Schema.Types.String, trim: true, index: true },
  id: { type: Schema.Types.Number, index: true },
  status: { type: Schema.Types.String, trim: true, index: true },
  external_reference: { type: Schema.Types.String, trim: true, index: true },
  preference_id: { type: Schema.Types.String, trim: true, index: true },
  payments: [],
  shipments: [],
  payouts: {},
  collector: {
    /*
    id: { type: Schema.Types.Number, index: true },
    email: { type: Schema.Types.String, trim: true, index: true },
    nickname: { type: Schema.Types.String, trim: true, index: true },
    */
  },
  marketplace: { type: Schema.Types.String, trim: true},
  date_created: { type: Schema.Types.Date },
  last_updated: { type: Schema.Types.Date },
  shipping_cost: { type: Schema.Types.Number },
  total_amount: { type: Schema.Types.Number },
  site_id: { type: Schema.Types.String, trim: true, index: true },
  paid_amount: { type: Schema.Types.Number },
  refunded_amount: { type: Schema.Types.Number },
  payer: {
    //id: { type: Schema.Types.Number, index: true },
  },
  items: [
    //{
    //  id: string;
    //  category_id: string;
    //  currency_id: string;
    //  description: string;
    //  picture_url: string;
    //  title: string;
    //  quantity: number;
    //  unit_price: number;
    //}
  ],
  cancelled: { type: Schema.Types.Boolean },
  additional_info: { type: Schema.Types.String, trim: true },
  application_id: { type: Schema.Types.Number },
  order_status: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


mertchant_orderSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Imertchant_order>('mertchant_order', mertchant_orderSchema);
