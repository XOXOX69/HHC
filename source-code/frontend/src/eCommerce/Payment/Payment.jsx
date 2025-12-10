import { LoadingOutlined, WalletOutlined } from "@ant-design/icons";
import { Form, Input, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loadAllCartByCustomerId } from "../../redux/rtk/features/eCommerce/cart/cartSlice";
import { addECommerceSale } from "../../redux/rtk/features/eCommerce/cartOrder/cartOrderSlice";
import { loadALLPaymentMethod } from "../../redux/rtk/features/paymentMethod/paymentMethodSlice";
import GcashPaymentModal from "../../components/GcashPayment/GcashPaymentModal";
import { couponCalculate } from "../../utils/functions";
import useCurrency from "../../utils/useCurrency";

export default function Payment() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const currency = useCurrency();
  const navigate = useNavigate();
  const { state } = useLocation();
  const customerId = localStorage.getItem("id");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showGcashModal, setShowGcashModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const { list, loading } = useSelector((state) => state.paymentMethod);
  const { list: cart } = useSelector((state) => state.cartDynamic);

  // Check if selected payment method is GCash
  const isGcashPayment = paymentMethod?.methodName?.toLowerCase().includes('gcash') || 
                         paymentMethod?.methodType === 'gcash';

  const getTotalAmount = () => {
    if (!cart) return 0;
    const baseAmount = couponCalculate(cart.totalAmount, state?.coupon)?.discountedPrice || cart.totalAmount;
    return baseAmount + (state?.deliveryFee || 0);
  };

  const onFinish = async (values) => {
    // If GCash payment, show the GCash modal instead
    if (isGcashPayment) {
      // First create the order
      const data = {
        customerId: parseInt(customerId),
        cartId: cart?.id,
        paymentMethodId: paymentMethod.id,
        deliveryAddress: state?.deliveryAddress,
        customerPhone: state?.customerPhone,
        deliveryFeeId: state?.deliveryFeeId,
        paymentStatus: 'pending', // GCash payments start as pending
      };

      if (state?.coupon) {
        data.couponCode = state?.coupon?.couponCode;
      }

      try {
        setLoader(true);
        const resp = await dispatch(addECommerceSale(data));
        if (resp.payload.message === "success") {
          setPendingOrderId(resp.payload.data.createdCartOrder?.id);
          setShowGcashModal(true);
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);
        message.error("Failed to create order");
      }
      return;
    }

    // Normal payment flow for non-GCash methods
    const data = {
      customerId: parseInt(customerId),
      cartId: cart?.id,
      paymentMethodId: paymentMethod.id,
      deliveryAddress: state?.deliveryAddress,
      customerPhone: state?.customerPhone,
      deliveryFeeId: state?.deliveryFeeId,
      ...values,
    };

    if (state?.coupon) {
      data.couponCode = state?.coupon?.couponCode;
    }

    try {
      setLoader(true);
      const resp = await dispatch(addECommerceSale(data));
      if (resp.payload.message === "success") {
        setLoader(false);
        dispatch(loadAllCartByCustomerId(customerId));
        navigate(`success?orderId=${resp.payload.data.createdCartOrder?.id}`);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const handleGcashSuccess = (transactionData) => {
    dispatch(loadAllCartByCustomerId(customerId));
    navigate(`success?orderId=${pendingOrderId}&gcash=true`);
  };

  const handleGcashCancel = () => {
    setShowGcashModal(false);
    setPendingOrderId(null);
  };

  useEffect(() => {
    if (customerId) {
      !cart && dispatch(loadAllCartByCustomerId(customerId));
    }
    dispatch(loadALLPaymentMethod());
  }, [cart, customerId, dispatch]);

  return (
    <div>
      <div className='container mt-10'>
        <div className='flex flex-col lg:flex-row gap-5 lg:gap-10'>
          <div className='w-full lg:w-[70%] flex flex-col gap-4'>
            <div className='bg-white rounded p-2 md:p-5'>
              <h1 className=' md:text-lg font-medium'>Select Payment Method</h1>
              <div className='flex items-center justify-center gap-2 flex-wrap mt-3 md:mt-5'>
                {loading && !list && (
                  <>
                    <div className='w-[100px] h-[40px] md:w-[140px] md:h-[60px] animate-pulse bg-slate-100 rounded'></div>
                    <div className='w-[100px] h-[40px] md:w-[140px] md:h-[60px] animate-pulse bg-slate-100 rounded'></div>
                    <div className='w-[100px] h-[40px] md:w-[140px] md:h-[60px] animate-pulse bg-slate-100 rounded'></div>
                    <div className='w-[100px] h-[40px] md:w-[140px] md:h-[60px] animate-pulse bg-slate-100 rounded'></div>
                  </>
                )}
                {list?.map((item) => {
                  const isGcash = item.methodName?.toLowerCase().includes('gcash') || item.methodType === 'gcash';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPaymentMethod(item)}
                      className={`flex items-center gap-2 py-1 px-2 md:py-1 md:px-4 rounded cursor-pointer ${
                        paymentMethod?.id === item.id
                          ? isGcash ? "bg-blue-300" : "bg-orange-300"
                          : "bg-slate-100"
                      } `}
                    >
                      {item.logo ? (
                        <img
                          src={`${import.meta.env.VITE_APP_API}/files/${item.logo}`}
                          alt=''
                          className='h-8 w-8 md:h-14 md:w-14 object-fill'
                          onError={(e) => {
                            if (isGcash) {
                              e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/17/GCash_logo.svg";
                            }
                          }}
                        />
                      ) : isGcash ? (
                        <WalletOutlined className="text-2xl md:text-4xl text-blue-600" />
                      ) : null}
                      <h3
                        className={`md:text-lg text-gray-600 md:font-extrabold ${
                          paymentMethod?.id === item.id && "text-gray-800"
                        }`}
                      >
                        {item.methodName}
                      </h3>
                    </div>
                  );
                })}
              </div>
              <hr className='my-3' />
              {paymentMethod && !isGcashPayment && (
                <div className='productDescription'>
                  <p className='text-center'>
                    <span>
                      Our Account:{" "}
                      <span className='font-semibold'>
                        {paymentMethod.ownerAccount}
                      </span>
                    </span>
                  </p>
                  <div
                    className='p-2 md:p-10'
                    dangerouslySetInnerHTML={{
                      __html: paymentMethod.instruction,
                    }}
                  />
                </div>
              )}
              {paymentMethod && isGcashPayment && (
                <div className='bg-gradient-to-b from-blue-500 to-blue-700 p-6 rounded-lg text-center'>
                  <div className='bg-white rounded-lg p-4 max-w-xs mx-auto shadow-lg'>
                    {/* QR Code Display */}
                    {paymentMethod.qrCodeImage ? (
                      <img
                        src={`${import.meta.env.VITE_APP_API}/files/${paymentMethod.qrCodeImage}`}
                        alt="GCash QR Code"
                        className='w-full max-w-[250px] mx-auto rounded-lg'
                      />
                    ) : (
                      <div className='w-[250px] h-[250px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center'>
                        <div className='text-center'>
                          <WalletOutlined className="text-5xl text-blue-500 mb-2" />
                          <p className='text-gray-500 text-sm'>QR Code not available</p>
                        </div>
                      </div>
                    )}
                    
                    <p className='text-gray-500 text-sm mt-3'>Transfer fees may apply.</p>
                    
                    {/* Account Name */}
                    <h3 className='text-xl font-bold text-blue-600 mt-2'>
                      {paymentMethod.ownerAccount || 'GCash Account'}
                    </h3>
                    
                    {/* Instructions */}
                    <div className='mt-4 text-left text-sm text-gray-600'>
                      <p className='font-semibold text-gray-800 mb-2'>How to pay:</p>
                      <ol className='list-decimal list-inside space-y-1'>
                        <li>Open your GCash app</li>
                        <li>Tap "Scan QR" or scan the code above</li>
                        <li>Enter amount: <span className='font-bold text-green-600'>
                          <span dangerouslySetInnerHTML={{ __html: currency?.currencySymbol }} />
                          {getTotalAmount().toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </span></li>
                        <li>Confirm and complete payment</li>
                        <li>Save your reference number</li>
                      </ol>
                    </div>
                  </div>
                  
                  <p className='text-white mt-4 text-sm'>
                    After payment, click "Pay with GCash" to enter your reference number
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='w-full lg:w-[30%]'>
            <div className='bg-white rounded p-3'>
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                  <h3 className='font-semibold'>Order summary</h3>
                </div>
                {cart && (
                  <div className='flex justify-between items-center'>
                    <h3 className='font-medium md:font-medium'>
                      Total payment
                    </h3>
                    <span className=''>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: currency?.currencySymbol,
                        }}
                      />{" "}
                      {getTotalAmount().toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                <p className='text-sm text-end pb-5'>
                  VAT included, where applicable and
                  <br />
                  delivery charge will be added
                </p>

                <Form
                  form={form}
                  onFinish={onFinish}
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  layout='horizontal'
                >
                  {paymentMethod && paymentMethod.id !== 1 && !isGcashPayment && (
                    <div>
                      <Form.Item
                        label='Your account'
                        name='CustomerAccount'
                        rules={[
                          {
                            required: true,
                            message: "Please input your account ",
                          },
                        ]}
                      >
                        <Input placeholder='Input your account ' />
                      </Form.Item>
                      <Form.Item
                        label='TRX-ID'
                        className='-mt-5 '
                        name='CustomerTransactionId'
                        rules={[
                          {
                            required: true,
                            message: "Please input Transaction Id",
                          },
                        ]}
                      >
                        <Input placeholder='Input Transaction Id' />
                      </Form.Item>
                    </div>
                  )}
                  <Form.Item
                    wrapperCol={{
                      span: 24,
                    }}
                  >
                    <button
                      disabled={!paymentMethod?.id || loader}
                      type='submit'
                      className={`w-full rounded-md py-2 text-white ${
                        !paymentMethod?.id 
                          ? "bg-slate-600" 
                          : isGcashPayment 
                            ? "bg-blue-500 hover:bg-blue-600" 
                            : "bg-ePrimary"
                      }`}
                    >
                      {loader && (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 18,
                                color: "#ffffff",
                                marginRight: "5px",
                              }}
                              spin
                            />
                          }
                        />
                      )}
                      {isGcashPayment ? (
                        <>
                          <WalletOutlined className="mr-2" />
                          Pay with GCash
                        </>
                      ) : (
                        "Confirm order"
                      )}
                    </button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GCash Payment Modal */}
      <GcashPaymentModal
        visible={showGcashModal}
        onCancel={handleGcashCancel}
        onSuccess={handleGcashSuccess}
        amount={getTotalAmount()}
        cartOrderId={pendingOrderId}
        customerId={parseInt(customerId)}
      />
    </div>
  );
}
