import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#1a1a1a',
            '::placeholder': { color: '#a3a3a3' },
        },
        invalid: { color: '#e5424d' },
    },
};

export const CustomCheckoutForm: React.FC<{ amount: number; onPaySubmit: any }> = ({ onPaySubmit, amount }) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [userDetails, setUserDetails] = useState();


    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("userDetails: ", userDetails);

        if (!stripe || !elements || !isAuthenticated) return;

        const cardNumberElement = elements.getElement(CardNumberElement);
        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement!,
            billing_details: { name, email },
        });

        if (result.error) {
            setStatus(`❌ ${result.error.message}`);
            return;
        }
        console.log("result: ", result);


        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMethodId: result.paymentMethod.id,
                email,
                amount,
                userID: user?.id
            }),
        });

        const data = await response.json();

        if (data.requiresAction) {
            const confirmResult = await stripe.confirmCardPayment(data.clientSecret);
            if (confirmResult.error) {
                setStatus(`❌ ${confirmResult.error.message}`);
            } else if (confirmResult.paymentIntent.status === 'succeeded') {
                setStatus('✅ Payment succeeded!');
                onPaySubmit();
            }
        } else if (data.success) {
            setStatus('✅ Payment succeeded!');
            onPaySubmit();
        } else {
            setStatus(`❌ ${data.error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded-md">
            <div>
                <label className="block text-sm font-medium">Name on Card *</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Card Number *</label>
                <div className="border px-3 py-2 rounded-md">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className="block text-sm font-medium">Expiry *</label>
                    <div className="border px-3 py-2 rounded-md">
                        <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium">CVC *</label>
                    <div className="border px-3 py-2 rounded-md">
                        <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
                🔒 Secure checkout with 256-bit SSL encryption
            </div>
            <button
                type="submit"
                disabled={!stripe}
                className="w-full bg-black text-white py-2 rounded-md"
            >
                CONTINUE TO REVIEW
            </button>
            {status && <p className="text-center text-sm mt-2">{status}</p>}
        </form>
    );
};
