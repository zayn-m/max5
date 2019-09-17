const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParse = require('body-parser');
const path = require('path');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paypal = require('@paypal/checkout-server-sdk');

// Add your credentials:
// Add your client ID and secret
const CLIENT = 'Af925DkD_aMbpDdIfOuwTulUeOpHvRhSMrhF50Hmp2ugwZZCOj0Ie7GEd8lt8eQTdjf77slKoniVWPht';
const SECRET = process.env.PAYPAL_SECRET_KEY;
const PAYPAL_API = 'https://api.sandbox.paypal.com';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

app.use(cors());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));

	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

app.listen(port, (error) => {
	if (error) throw error;

	console.log('Server running on port ' + port);
});

app.post('/payment', (req, res) => {
	const body = {
		source: req.body.token.id,
		amount: req.body.amount,
		currency: 'usd'
	};

	stripe.charges.create(body, (stripeErr, stripeRes) => {
		if (stripeErr) {
			res.status(500).send({ error: stripeErr });
		} else {
			res.status(200).send({ success: stripeRes });
		}
	});
});

app.post('/paypal-payment', (req, res) => {
	// 2. Get the payment ID and the payer ID from the request body.
	var paymentID = req.body.orderID;
	var payerID = req.body.payerID;
	// 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
	request.post(
		PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute',
		{
			auth: {
				user: CLIENT,
				pass: SECRET
			},
			body: {
				payer_id: payerID,
				transactions: [
					{
						amount: {
							total: '10.99',
							currency: 'USD'
						}
					}
				]
			},
			json: true
		},
		function(err, response) {
			if (err) {
				return res.sendStatus(500);
			}
			// 4. Return a success response to the client
			res.status(200).send({ status: 'success' });
		}
	);
});
