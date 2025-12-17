import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function PhonePage() {
  const [phone, setPhone] = useState('')
  const navigate = useNavigate()

  const submitHandler = async () => {
    if (phone.length !== 11) {
      alert('شماره باید ۱۱ رقم باشد')
      return
    }

    try {
      const res = await fetch('https://apigw.stage.tala.land/idp/auth/otpRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: phone }),
      })

      if (res.ok) {
        navigate('/otp', { state: { phone } })
      } else {
        alert('خطا در ارسال کد')
      }
    } catch {
      alert('مشکل شبکه')
    }
  }

  return (
    <div className="container">
      <h2 className="title">ورود / ثبت‌نام</h2>
      <p className="subtitle">جهت ورود شماره تلفن خود را وارد نمایید.</p>
      <div className="input-box">
        <input
          type="tel"
          placeholder="شماره تماس"
          maxLength={11}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        />
      </div>
      <button
        className={`btn ${phone.length !== 11 ? 'disabled' : ''}`}
        disabled={phone.length !== 11}
        onClick={submitHandler}
      >
        ارسال کد
      </button>
    </div>
  )
}
