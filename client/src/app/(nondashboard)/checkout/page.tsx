"use client";

import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";

const CheckoutWizard = () => {
  const { isLoaded } = useUser();
  const { checkoutStep } = useCheckoutNavigation();

  if (!isLoaded) return <Loading />;

  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return "case 1";
      case 2:
        return "case 2";
      case 3:
        return "case 3";
      default:
        return "case 1";
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__content">{renderStep()}</div>
    </div>
  );
};

export default CheckoutWizard;
