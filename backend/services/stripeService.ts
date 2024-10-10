import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {apiVersion: '2024-06-20'});


export const fetchCustomerPayments = async (stripeId: string) => {
    try {
        const payments = await stripe.paymentIntents.list({ 
            customer: stripeId 
        });

        return payments.data;
    } catch (error) {
        console.error('Error fetching payments from Stripe:', error);
        throw error;
    }
};

// interface customerInvoicesParams extends PaginationParams, InvoiceListParams {}

interface stripeApiRequest {
    customer: string; 
    limit: number;
    starting_after?: number;
}

export const fetchCustomerInvoices = async (stripeId: string) => {
    try {
        let invoiceIds: string[] = [];

        let hasMore = true;
        let startingAfter = null;

        let request: stripeApiRequest = {
            customer: stripeId,
            limit: 100 
        }

        while (hasMore) {
            let response: any = await stripe.invoices.list(request);

            invoiceIds = response.data.map((invoice: any) => invoice.id);

            hasMore = response.has_more;
            if (hasMore) {
                request.starting_after = response.data[response.data.length - 1].id; 
            }
        }

        /*
        while (hasMore) {
            const response: any = await stripe.invoices.list({
                customer: stripeId,
                limit: 100,
                starting_after: startingAfter,
            });

            invoiceIds = response.data.map((invoice: any) => invoice.id);

            hasMore = response.has_more;
            if (hasMore) {
                startingAfter = response.data[response.data.length - 1].id; 
            }
        }
        */

        return invoiceIds;
    } catch (error) {
        console.error('Error fetching invoices from Stripe:', error);
        throw error
    }
};

