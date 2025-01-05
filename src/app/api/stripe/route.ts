import prisma from "@/lib/db";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // verify webook came from Stripe
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // return 400 bad request
    console.log("Webhook verification failed", error);
    return Response.json(null, { status: 400 });
  }

  // fulfill order
  switch (event.type) {
    case "checkout.session.completed":
      return await handleCheckoutSessionCompleted(event);
    default:
      console.log("Unhandled event type", event.type);
  }

  // return 200 OK
  return Response.json(null, { status: 200 });
}

async function handleCheckoutSessionCompleted(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  const customerEmail = event.data.object.customer_email;

  if (!customerEmail) {
    console.log("Customer email is missing or invalid");
    return Response.json(null, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: {
        email: customerEmail,
      },
      data: {
        hasAccess: true,
      },
    });
  } catch (error) {
    console.log("User not found", error);
    return Response.json({ error: "Database update failed" }, { status: 400 });
  }

  return Response.json({ success: true }, { status: 200 });
}
