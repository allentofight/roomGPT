"use client";

import { useState, useEffect } from 'react';


import { loginUtil } from "../../utils/loginUtil";

const apiHost = process.env.NEXT_PUBLIC_API_HOST;



export default function LoginForm() {

    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [count, setCount] = useState(60);
    const [disabled, setDisabled] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [inviteCode, setInviteCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        let inviteCode = queryParams.get('inviteCode')
        if (inviteCode) {
            setInviteCode(inviteCode)
        }

        let sessionId = localStorage.getItem('sessionId')
        if (sessionId) {
            window.location.href = '/'
        }
    }, []);

    function isPhoneValid() {
        var myreg = /^1[3-9]\d{9}$/;
        return myreg.test(phone)
    }

    const sendCode = async () => {
        if (!isPhoneValid()) {
            alert('手机号有误');
            return
        }

        setDisabled(true);
        let response = await fetch('https://api-tt.beisheng.com/japi/outer/api/auth?member.sms.send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'tel': phone,
                'type': 3,
            })
        });
        const result = await response.json()
        if (result.success) {
            let intervalId = setInterval(() => {
                setCount(count - 1);
            }, 1000);

            setTimeout(() => {
                clearInterval(intervalId);
                setDisabled(false);
                setCount(60);
            }, 60000);
        } else {
            alert(result.message);
            setDisabled(false);
        }
    };

    const login = async () => {
        var myreg = /^1[3-9]\d{9}$/;
        if (!myreg.test(phone)) {
            alert('手机号有误');
            return
        }

        setSubmitDisabled(true)
        let response = await fetch('https://api-tt.beisheng.com/japi/outer/api/auth?gpt.login.codeverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'tel': phone,
                'code': code,
                'type': 3
            })
        });
        const result = await response.json()
        if (result.success) {
            const response = await fetch(`${apiHost}/api/auth/signIn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    inviteCode: inviteCode
                }),
            });

            const result = await response.json()
            if (response.status !== 200) {
                alert(result.message);
                return
            }
            localStorage.setItem('sessionId', result.sessionId)
            localStorage.setItem('inviteCode', result.inviteCode)
            window.location.href = '/'

        } else {
            alert(result.message);
            setSubmitDisabled(false)
        }
    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-90">
            <div className="bg-white rounded-lg p-6 w-95">
                <h2 className="text-center text-xl mb-6 text-gray-500">登录</h2>
                <div className="mb-4">
                    <input
                        type="tel"
                        className="border rounded w-full py-2 px-3 text-gray-500"
                        placeholder="请输入手机号"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        className="border rounded w-2/3 py-2 px-3 text-gray-500"
                        placeholder="验证码"
                        value={code}
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                            setCode(target.value);
                            setSubmitDisabled(!target.value); // Update submitDisabled based on the input's value
                        }}
                    />
                    <button
                        className={`w-1/3 ml-4 py-2 px-1 rounded ${disabled ? "bg-gray-300" : "bg-green-500 text-white"} whitespace-nowrap`}
                        disabled={disabled}
                        onClick={sendCode}
                    >
                        {disabled ? `${count}s` : "发送验证码"}
                    </button>
                </div>
                <div className="flex justify-center mt-3">
                    <button
                        className={`w-full ${submitDisabled ? 'bg-opacity-50' : ''} py-2 px-4 rounded bg-blue-500 text-white`}
                        onClick={login}
                        disabled={submitDisabled}
                    >
                        登录
                    </button>
                </div>
            </div>
        </div >

    );
}
