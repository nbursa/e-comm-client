import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:9000',
    credentials: true,
  }),
);

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    debug: true,
    logger: true,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

let transporter = createTransporter();

const verifyConnection = async (retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.verify();
      console.log('SMTP Connection Ready');
      return true;
    } catch (error) {
      console.error(`SMTP Connection Error (attempt ${i + 1}):`, error);
      if (i === retries - 1) return false;
      transporter = createTransporter();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return false;
};

app.get('/api/verify-email', async (req, res) => {
  const isConnected = await verifyConnection();
  if (isConnected) {
    res.json({ status: 'success', message: 'SMTP connection verified' });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'SMTP verification failed after retries',
    });
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { email, orderDetails } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email address',
      });
    }

    if (!orderDetails || !orderDetails.items || !orderDetails.items.length) {
      return res.status(400).json({
        error: 'Invalid order details',
      });
    }

    const html = createOrderConfirmationEmail(orderDetails);
    const mailOptions = {
      from: `"E-Commerce Platform" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Order Confirmation',
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to send email',
      message: errorMessage,
    });
  }
});

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const createOrderConfirmationEmail = (orderDetails) => {
  const items = orderDetails.items
    .map(
      (item) => `
    <tr>
      <td>${item.title}</td>
      <td>${item.quantity}</td>
      <td>${formatPrice(item.price)}</td>
      <td>${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>

        <h2>Order Details</h2>
        <p>Order Total: ${formatPrice(orderDetails.total)}</p>

        <h3>Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          ${items}
        </table>

        <h3>Shipping Information</h3>
        <p>
          ${orderDetails.firstName} ${orderDetails.lastName}<br>
          ${orderDetails.email}<br>
          ${orderDetails.address}
        </p>

        <p>We'll let you know when your order ships!</p>
      </div>
  `;
};

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await verifyConnection();
});
