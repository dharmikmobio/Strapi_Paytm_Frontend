import React, { useState } from 'react';
import { useStepsForm } from 'sunflower-antd';
import { Steps, Input, Button, Form, message } from 'antd';
import { Helmet } from "react-helmet";
import OtpInput from "react-otp-input";


const { Step } = Steps;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function StepsCopy() {
    <Helmet>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
    </Helmet>

    const [a, setA] = useState("");
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [numbers, setNumber] = useState("")
    const [amount, setAmount] = useState("")
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [panc, setPanC] = useState("")


    const subbmitdata = async () => {
        setLoading(true);

        const rawResponse = await fetch(`${process.env.REACT_APP_DEV_MODE}/api/otp`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data:{
                    
                    number: numbers
                }
   
            })
        });
    
        setLoading(false);

        if (rawResponse.status === 200) {
            success(); 
            gotoStep(current + 1);
            
        }else{
            errorotp();
           
        }
       
    }

    const submitOTP = async () => {

     
        setLoading(true);
        const rawResponse = await fetch(`${process.env.REACT_APP_DEV_MODE}/api/otp-verify`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // email: email,
                data:{

                    number: numbers,
                    otp: code
                }
          
            })
        });


        setLoading(false);
        const get = await rawResponse.json();
 

        if (get.status === "approved") {
             successotp(); 
             gotoStep(current + 1);
        }else{
            errorotp();
        }
 
    }

    const CompleteSubmit = async () => {

        const orderid = "OID55ID" + Math.floor(10000000000 * Math.random())
        const custid = "CUST" + Math.floor(1000000000000 * Math.random())
        setLoading(true);
        const rawResponse = await fetch(`${process.env.REACT_APP_DEV_MODE}/api/transactions`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                data:{

                    // number: numbers,
                    // code: code
                    orderid: orderid,
                     amount: amount,
                    custid: custid
                }
          
            })
        });
        const content = await rawResponse.json();


        setLoading(false);


        localStorage.setItem('token', content.body.txnToken);
  
        console.log('amount', amount)
        console.log('a', a)
        var config = {
            "root": "",
            "flow": "DEFAULT",
            "data": {
                "orderId": orderid, /* update order id */
                "token": content.body.txnToken, /* update token value */
                "tokenType": "TXN_TOKEN",
                "amount": a /* update amount */
            },
            "handler": {
                "notifyMerchant": function (eventName, data) {
                    console.log("notifyMerchant handler function called");
                    console.log("eventName => ", eventName);
                    console.log("data => ", data);
                }
            }
        };
        // console.log("window.Paytm", window.Paytm.CheckoutJS)
        if (window.Paytm && window.Paytm.CheckoutJS) {
            window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
                window.Paytm.CheckoutJS.invoke();
            }).catch(function onError(error) {
                console.log("errors => ", error);
            });
        }
    }



    const {
        form,
        current,
        gotoStep,
        stepsProps,
        formProps,
        submit,
        // formLoading,
    } = useStepsForm({
        async submit(values) {
            // const { name, email, phone, amount } = values;
            const { amount, code  } = values;
            if (amount !== "") {
                setA(amount);
                setA(email);
                setA(numbers);
                setA(panc);
                setA(address);
                setA(name);
                setA(code);
   
                return 'ok';
            } else {
                return null
   
            }

        },
        total: 3,
    });

    const success = () => {
        message.success('OTP is send your mobile number');
    };
    const successotp = () => {
        message.success('OTP is verified');
    };
    const errorotp = () => {
        message.error('OTP is unvalid');
    };



    const formList = [
        <>
            <Form.Item
                label="Full Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input name',
                    },
                ]}
            >
                <Input placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item label="Email" name="email">
                <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item label="Address" name="address">
                <Input placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>
            <Form.Item label="Pan Card" name="pancard">
                <Input placeholder="Pan Card" onChange={(e) => setPanC(e.target.value)} />
            </Form.Item>
            <Form.Item label="Phone Number" name="Phone Number" type="number" maxLength={10}
             validateTrigger="onBlur"
             hasFeedback
              rules={[
                {
                    required: true,
                },
                () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (isNaN(value)) {
                        return Promise.reject("Please input only 10 Digit number");
                      }
                      if (value.length < 10) {
                        return Promise.reject("Phone Number can't be less than 10 digits");
                      }
                      if (value.length > 10) {
                        return Promise.reject("Phone Number can't be more than 10    digits");
                      }
                      return Promise.resolve();
                    },
                  }),
            ]}
            >
                <Input placeholder="Phone Number"  type="number" maxLength={10} onChange={(e) => setNumber(e.target.value)} />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button
                    style={{ float: 'right' }}
                    type="primary"
                     disabled={loading}
                    onClick={() => {

                        submit().then(result => {
                            if (result === 'ok') {
                                subbmitdata();

                                // gotoStep(current + 1);
                            }
                        });

                    }}

                > {loading ? `Loading...` : "Next"}</Button>
            </Form.Item>
        </>,

        <>

            {/* <Form.Item
                label="Amount"
                name="amount"
            // rules={[
            //     {
            //         required: true,
            //         message: 'Please input address',
            //     },
            // ]}
            >
                <Form.Item name="amount">
                    <Input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />

                </Form.Item>
            </Form.Item> */}
            <div className="otps">
                <OtpInput
                    value={code}
                    onChange={(otp) => {
                        setCode(otp)

                    }}
                    numInputs={6}
                    separator={<span style={{ width: "8px" }}></span>}
                    isInputNum={true}
                    shouldAutoFocus={true}
                    inputStyle={{
                        border: "1.5px solid black",
                        borderRadius: "8px",
                        width: "54px",
                        height: "54px",
                        fontSize: "18px",
                        color: "#000",
                        fontWeight: "600",
                        caretColor: "blue",
                        // textAlign: "center",
                    }}
                    focusStyle={{
                        border: "3px solid green",
                        outline: "none"
                    }}
                />
                <div className="con">
            <Form.Item {...tailLayout}>
                {<Button
                    style={{ float: "right", margin: 8 }}
                    type="primary"
                    // loading={formLoading}
                    // loading={loadings[0]}
                    // disabled={loading}
                    onClick={() => {
                        // enterLoading(0)
                        submit().then(result => {
                            // setLoading(true);
                            if (result === 'ok') {
                                // gotoStep(current + 1);
                                // handleChange()
                                submitOTP();
                                // subbmitdata();
                                // form.resetFields();

                            }

                            // setLoading(false);
                        });
                    }}
                >
                   Submit
                </Button>}
                <Button style={{ float: "right", margin: 8 }} onClick={() => gotoStep(current - 1)}>Prev</Button>
            </Form.Item>
            </div>
            </div>
        </>,
    ];

    return (
        <>
            <div className="application">
                <Helmet>
                
                    <script id="Paytm" type="application/javascript"
                        src={`https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/duMLWy61727696528884.js`}
                        crossorigin="anonymous" data-react-helmet="true"></script>

                </Helmet>

            </div>

            <div className='container'>

                <Steps {...stepsProps}>
                    <Step title="Step 1" />
                    <Step title="Step 2" />
                    <Step title="Step 3" />
                </Steps>
                <div className="card m-5">
                    <div className="card-body">
                        <div style={{ marginTop: 60 }} className="bcontent"  >
                            <Form {...layout} {...formProps}
                            //  style={{ maxWidth: 600 }}
                            >
                                {formList[current]}
                            </Form>

                            {current === 2 && (
                                
                                        <>
                                            <Form.Item
                                                label="Amount"
                                                name="amount"
                                            // rules={[
                                            //     {
                                            //         required: true,
                                            //         message: 'Please input address',
                                            //     },
                                            // ]}
                                            >
                                                <Form.Item name="amount">
                                                    <Input placeholder="Amount" className='innput' onChange={(e) => setAmount(e.target.value)} />

                                                </Form.Item>
                                            </Form.Item>
                                            <Button
                                            className='bbtn'
                                              disabled={loading}
                                                type="primary"
                                                onClick={() => {
                                                    CompleteSubmit();
                                                    form.resetFields();
                                                    // gotoStep(0);
                                                }}
                                            >
                                                {loading ? `Loading...` : "Submit"}
                                            </Button>
                                            {/* <Button>Check detail</Button> */}
                                        </>
                                
                            
                            )}

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
