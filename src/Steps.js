import React, { useState } from 'react';
import { useStepsForm } from 'sunflower-antd';
import { Steps, Input, Button, Form } from 'antd';
import { Helmet } from "react-helmet";

const { Step } = Steps;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

// eslint-disable-next-line
export default (props) => {
    <Helmet>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
    </Helmet>

    // const [token, setToken] = useState("");
    // const [orderId, setOrderId] = useState("");
    const [a, setA] = useState("");
    const subbmitdata = async () => {
        const orderid = "OID55ID" + Math.floor(10000000000 * Math.random())
        const custid = "CUST" + Math.floor(1000000000000 * Math.random())
        // setOrderId(orderid);
        const rawResponse = await fetch('http://af71-180-211-104-117.ngrok.io/api/otp', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            // body: JSON.stringify({
            //     orderid: orderid, amount: a, custid: custid
            //     //   , name: name ,email: email , number: number, amount: amount
            // })
        });
        const content = await rawResponse.json();
        // setToken(content.body.txnToken);
        // localStorage.setItem('token', content.body.txnToken);
        console.log("thsi is run :", a)
        console.log(content.body);
        // onScriptLoad();
        console.log("thsi is run orderId :", orderid)
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
        console.log("window.Paytm", window.Paytm.CheckoutJS)
        if (window.Paytm && window.Paytm.CheckoutJS) {
            window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
                window.Paytm.CheckoutJS.invoke();
            }).catch(function onError(error) {
                console.log("errors => ", error);
            });
        }
    }

    const {

        current,
        gotoStep,
        stepsProps,
        formProps,
        submit,
        formLoading,
    } = useStepsForm({
        async submit(values) {
            const { name, email, phone, amount } = values;
            console.log("AMOUNT : ",name, email, phone, amount);
            setA(amount);
            await new Promise(r => setTimeout(r, 1000));
            return 'ok';
        },
        total: 3,
    });

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
                <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone">
                <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button
                    style={{ float: 'right' }}
                    type="primary"
                    onClick={() => {
                        submit().then(result => {
                            if (result === 'ok') {
                                // subbmitdata();
                                gotoStep(current + 1);
                            }
                        });
                    }}

                >Next</Button>
            </Form.Item>
        </>,

        <>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        message: 'Please input address',
                    },
                ]}
            >
                <Form.Item name="amount">
                    <Input placeholder="Amount" />
                </Form.Item>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button
                    style={{ float: "right", margin: 8 }}
                    type="primary"
                    loading={formLoading}
                    onClick={() => {

                        submit().then(result => {
                            if (result === 'ok') {
                                // gotoStep(current + 1);
                                subbmitdata();
                            }
                        });
                    }}
                >
                    Submit
                </Button>
                <Button style={{ float: "right", margin: 8 }} onClick={() => gotoStep(current - 1)}>Prev</Button>
            </Form.Item>
        </>,
    ];

    return (
        <>
            <div className="application">
                <Helmet>
                    {/* <script src="https://use.typekit.net/foobar.js"></script> */}
                    {/* <script>try{Typekit.load({ async: true });}catch(e){}</script> */}
                    <script id="Paytm" type="application/javascript"
                        src={`https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/duMLWy61727696528884.js`}
                        crossorigin="anonymous" data-react-helmet="true"></script>

                    {/* <script id="Paytm" type="application/javascript"
        src={`securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${token}.js`}

        crossorigin="anonymous"></script> */}
                </Helmet>

            </div>

            <div className='container'>

                <Steps {...stepsProps}>
                    <Step title="Step 1" />
                    <Step title="Step 2" />
                    {/* <Step title="Step 3" /> */}
                </Steps>
                <div className="card m-5">
                    <div className="card-body">
                        <div style={{ marginTop: 60 }}>
                            <Form {...layout} {...formProps}
                            //  style={{ maxWidth: 600 }}
                            >
                                {formList[current]}
                            </Form>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

