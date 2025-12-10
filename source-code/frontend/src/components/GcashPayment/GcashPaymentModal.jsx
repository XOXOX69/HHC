import { Button, Form, Input, Modal, Spin, Steps, message } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import {
  initializeGcashPayment,
  verifyGcashPayment,
} from "../../redux/rtk/features/gcash/gcashSlice";
import { loadALLPaymentMethod } from "../../redux/rtk/features/paymentMethod/paymentMethodSlice";
import useCurrency from "../../utils/useCurrency";

const { Step } = Steps;

export default function GcashPaymentModal({
  visible,
  onCancel,
  onSuccess,
  amount,
  cartOrderId,
  customerId,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const currency = useCurrency();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [copied, setCopied] = useState(false);

  const { list: paymentMethods } = useSelector((state) => state.paymentMethod);

  // Find GCash payment method
  const gcashPaymentMethod = paymentMethods?.find(
    (pm) => pm.methodType === 'gcash' || pm.methodName?.toLowerCase().includes('gcash')
  );

  // GCash number from payment method
  const gcashNumber = gcashPaymentMethod?.ownerAccount || "09XX XXX XXXX";
  const gcashName = "GCash Store";

  useEffect(() => {
    if (visible && !paymentMethods) {
      dispatch(loadALLPaymentMethod());
    }
  }, [visible, paymentMethods, dispatch]);

  const handleInitializePayment = async (values) => {
    try {
      setLoading(true);
      const response = await dispatch(
        initializeGcashPayment({
          customerId,
          cartOrderId,
          amount,
          paymentMethodId: gcashPaymentMethod?.id,
          senderMobile: values.gcashNumber,
          senderName: values.gcashAccountName,
        })
      );

      if (response.payload?.data?.message === 'Payment initialized successfully') {
        setTransactionData(response.payload.data.data);
        setCurrentStep(1);
      } else {
        message.error(response.payload?.message || "Failed to initialize payment");
      }
    } catch (error) {
      message.error("Failed to initialize GCash payment");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (values) => {
    try {
      setLoading(true);
      const response = await dispatch(
        verifyGcashPayment({
          id: transactionData.transactionId,
          values: {
            gcashReferenceNumber: values.customerReference,
            remarks: 'Customer submitted reference',
          },
        })
      );

      if (response.payload?.data?.message?.includes('success') || response.payload?.message === 'success') {
        setCurrentStep(2);
        message.success("Payment submitted for verification!");
        // Wait a moment before calling onSuccess
        setTimeout(() => {
          onSuccess?.(response.payload.data);
        }, 2000);
      } else {
        message.error(response.payload?.message || "Failed to verify payment");
      }
    } catch (error) {
      message.error("Failed to verify GCash payment");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    message.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setTransactionData(null);
    form.resetFields();
    onCancel?.();
  };

  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <img
          src="/images/gcash-logo.png"
          alt="GCash"
          className="h-16 mx-auto mb-2"
          onError={(e) => {
            e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/17/GCash_logo.svg";
            e.target.onerror = null;
          }}
        />
        <h3 className="text-lg font-semibold text-blue-800">Pay with GCash</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          <span dangerouslySetInnerHTML={{ __html: currency?.currencySymbol }} />{" "}
          {parseFloat(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleInitializePayment}
      >
        <Form.Item
          name="gcashNumber"
          label="Your GCash Number"
          rules={[
            { required: true, message: "Please enter your GCash number" },
            {
              pattern: /^(09|\+639)\d{9}$/,
              message: "Please enter a valid Philippine mobile number",
            },
          ]}
        >
          <Input
            placeholder="09XX XXX XXXX"
            maxLength={11}
            className="text-lg"
          />
        </Form.Item>

        <Form.Item
          name="gcashAccountName"
          label="GCash Account Name"
          rules={[
            { required: true, message: "Please enter your GCash account name" },
          ]}
        >
          <Input placeholder="Juan Dela Cruz" className="text-lg" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="bg-blue-500 hover:bg-blue-600 h-12 text-lg"
        >
          Continue to Payment
        </Button>
      </Form>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* QR Code Display */}
      {gcashPaymentMethod?.qrCodeImage && (
        <div className="bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-lg">
          <div className="bg-white rounded-lg p-3 max-w-[200px] mx-auto">
            <img
              src={`${import.meta.env.VITE_APP_API}/files/${gcashPaymentMethod.qrCodeImage}`}
              alt="GCash QR Code"
              className="w-full rounded"
            />
          </div>
          <p className="text-white text-center text-sm mt-2">Scan to pay with GCash</p>
        </div>
      )}

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-3">
          Send payment to this GCash account:
        </h4>
        <div className="bg-white p-3 rounded border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">GCash Number:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg">{gcashNumber}</span>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(gcashNumber.replace(/\s/g, ""))}
                size="small"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Name:</span>
            <span className="font-semibold">{gcashName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-green-600 text-lg">
              <span dangerouslySetInnerHTML={{ __html: currency?.currencySymbol }} />{" "}
              {parseFloat(amount).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Your Reference Number:</h4>
        <div className="flex items-center justify-center gap-2 bg-white p-3 rounded border">
          <span className="font-mono text-xl font-bold text-blue-600">
            {transactionData?.referenceNumber}
          </span>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(transactionData?.referenceNumber)}
          />
        </div>
        <p className="text-sm text-yellow-700 mt-2 text-center">
          Please include this reference number in your GCash payment message
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleVerifyPayment}
      >
        <Form.Item
          name="customerReference"
          label="GCash Reference Number (from your GCash app)"
          rules={[
            { required: true, message: "Please enter GCash reference number" },
          ]}
          extra="Enter the reference number from your GCash transaction receipt"
        >
          <Input
            placeholder="Enter GCash reference number"
            className="text-lg font-mono"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="bg-green-500 hover:bg-green-600 h-12 text-lg"
        >
          Confirm Payment
        </Button>
      </Form>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center py-8">
      <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-green-700 mb-2">
        Payment Submitted!
      </h3>
      <p className="text-gray-600 mb-4">
        Your payment is being verified. You will receive a confirmation once
        approved.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Reference Number:</p>
        <p className="font-mono text-lg font-bold text-blue-600">
          {transactionData?.referenceNumber}
        </p>
      </div>
    </div>
  );

  const steps = [
    { title: "Enter Details", content: renderStep0() },
    { title: "Send Payment", content: renderStep1() },
    { title: "Complete", content: renderStep2() },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <img
            src="/images/gcash-logo.png"
            alt="GCash"
            className="h-6 w-6"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span>GCash Payment</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={480}
      destroyOnClose
    >
      <Steps current={currentStep} size="small" className="mb-6">
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </Modal>
  );
}
