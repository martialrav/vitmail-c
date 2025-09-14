import { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Modal from '@/components/Modal/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { redirectToCheckout } from '@/lib/client/stripe';
import { getInvoices, getProducts } from '@/lib/server/stripe';
import { getPayment } from '@/prisma/services/customer';

const Billing = ({ invoices, products }) => {
  const [isSubmitting, setSubmittingState] = useState(false);
  const [showModal, setModalVisibility] = useState(false);

  const subscribe = (priceId) => {
    setSubmittingState(true);
    api(`/api/payments/subscription/${priceId}`, {
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        (async () => redirectToCheckout(response.data.sessionId))();
      }
    });
  };

  const toggleModal = () => setModalVisibility(!showModal);

  return (
    <AccountLayout>
      <Meta title="Vitmail-C - Billing" />
      <Content.Title
        title="Billing"
        subtitle="Manage your billing and preferences"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Upgrade Plan"
            subtitle="You are currently under the&nbsp; FREE plan"
          >
            <p className="p-3 text-sm border rounded">
              Personal accounts cannot be upgraded and will remain free forever.
              In order to use the platform for professional purposes or work
              with a team, get started by creating a team or contacting sales.
            </p>
          </Card.Body>
          <Card.Footer>
            <small>You will be redirected to the payment page</small>
            <Button
              className="text-white bg-gradient-to-r from-vitamin-600 to-vitamin-700 hover:from-vitamin-700 hover:to-vitamin-800"
              disabled={isSubmitting}
              onClick={toggleModal}
            >
              Join Pro Waitlist
            </Button>
          </Card.Footer>
        </Card>
        <Modal
          show={showModal}
          title="Join Pro Waitlist"
          toggle={toggleModal}
        >
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-vitamin-600 to-vitamin-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Pro Features Coming Soon!
            </h3>
            <p className="text-gray-600">
              We're working hard on advanced features. Join our waitlist to be the first to know when they're available!
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">🎉 What's coming:</span> Unlimited domain monitoring, advanced analytics, team collaboration, and priority support!
              </p>
            </div>
            <Button
              className="w-full text-white bg-gradient-to-r from-vitamin-600 to-vitamin-700 hover:from-vitamin-700 hover:to-vitamin-800"
              onClick={() => {
                // Redirect to main page waitlist or show form
                window.location.href = '/check';
              }}
            >
              Join Waitlist
            </Button>
          </div>
        </Modal>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Invoices"
        subtitle="View and download invoices you may need"
      />
      <Content.Divider />
      {invoices.length > 0 ? (
        <Content.Container>
          <table className="table-auto">
            <thead>
              <tr className="text-left">
                <th>Invoice Number</th>
                <th>Created</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} className="text-sm hover:bg-gray-100">
                  <td className="px-3 py-5">
                    <Link
                      href={invoice.hosted_invoice_url}
                      className="text-blue-600"
                      target="_blank"
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="py-5">
                    {formatDistance(
                      new Date(invoice.created * 1000),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </td>
                  <td className="py-5">{invoice.status}</td>
                  <td className="py-5">
                    <Link
                      href={invoice.hosted_invoice_url}
                      className="text-blue-600"
                      target="_blank"
                    >
                      &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Content.Container>
      ) : (
        <Content.Empty>
          Once you&apos;ve paid for something on Vitmail-C, invoices will show
          up here
        </Content.Empty>
      )}
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const customerPayment = await getPayment(session.user?.email);
  const [invoices, products] = await Promise.all([
    getInvoices(customerPayment?.paymentId),
    getProducts(),
  ]);
  return {
    props: {
      invoices,
      products,
    },
  };
};

export default Billing;
