"use client"
import Header from '@/components/Header';
import React, { useState } from 'react';
import Plan from './plan';
import MakePayment from './makePayment';
import handlePayment from '@/actions/handlePayment';
import { Session } from '@/typings/session';

interface Plan {
    plan: string;
    price: number;
    features: string[];
}

interface Props {
    session: Session | null
}

const Subscription: React.FC<Props> = ({ session }) => {
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [price, setPrice] = useState(0);


    const handlePlanSelect = (plan: string, price: number) => {
        setSelectedPlan(plan);
        setPrice(price);
    };

    const plans: Plan[] = [
        {
            plan: 'Basic',
            price: 100,
            features: ['8 itineraries per month', 'Access to basic travel planning features', 'Email support']
        },
        {
            plan: 'Standard',
            price: 200,
            features: ['10 itineraries per month', 'Access to standard travel planning features', 'Priority email support']
        },
        {
            plan: 'Premium',
            price: 500,
            features: ['15 itineraries per month', 'Access to all travel planning features', '24/7 phone and email support']
        }
    ];

    const getDisabledStatus = (plan: string) => {
        const subscription = session?.subscription;

        if (subscription === "FREE") {
            return false; // All plans are enabled for FREE subscription
        }

        if (subscription === "BASIC") {
            return plan === 'Basic'; // Only the Basic plan is disabled
        }

        if (subscription === "STANDARD") {
            return plan === 'Basic' || plan === 'Standard'; // Basic and Standard plans are disabled
        }

        if (subscription === "PREMIUM") {
            return true; // All plans are disabled
        }

        return false;
    }

    const isButtonDisabled = () => {
        if (session?.subscription === "PREMIUM") return true;
        return !selectedPlan;
    };

    return (
        <div className='w-screen h-screen overflow-hidden'>
            <Header show={false} />
            <div className="flex-1 flex flex-col items-center h-full pt-20">
                <h1 className="text-4xl font-bold pb-10 text-center">Update Your Subscription</h1>
                <div className="flex gap-x-20">
                    {plans.map((plan) => (
                        <Plan
                            key={plan.plan}
                            plan={plan.plan}
                            price={plan.price}
                            features={plan.features}
                            selected={selectedPlan === plan.plan}
                            disabled={getDisabledStatus(plan.plan)}
                            onSelect={handlePlanSelect}
                        />
                    ))}
                </div>
                <MakePayment
                    handleSubmit={handlePayment}
                    price={price}
                    selectedPlan={selectedPlan}
                    disabled={isButtonDisabled()}
                />
            </div>
        </div>
    );
};

export default Subscription;
