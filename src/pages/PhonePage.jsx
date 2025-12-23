import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function PhonePage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false) //task loading  state
  const [error, setError] = useState("")  // task error state
  const navigate = useNavigate()
  const isValidPhone = /^09\d{9}$/.test(phone)  // phone mge nbyd ba brCKET bashe?

  const submitHandler = async () => {
    if (!isValidPhone) {
      setError("شماره مبایل معتبر نیست")
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://apigw.stage.tala.land/idp/auth/otpRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: phone }), // username;phonr
      })
      const data = await res.json()

      if (data.success) {
        navigate('/otp', { state: { phone } })
      } else {
        setError(data.message || 'خطا در ارسال کد')
      }
    } catch {
      setError('مشکل در شبکه')
    }
    finally {
      setLoading(false)  // chera?
    }

  }

  return (
    <div className="container">

      {/*
           logo 
      */}
      <h2 className="title">ورود / ثبت‌نام</h2>
      <p className="subtitle">جهت ورود شماره تلفن خود را وارد نمایید.</p>
      <div className="input-box">
        <input
          type="tel"
          placeholder="شماره تماس"
          maxLength={11}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // replace 
        />
      </div>
      {error && <p className='error'>{error}</p>}
      <button
        className='btn'
        disabled={!isValidPhone || loading}
        onClick={submitHandler}
      >
        {loading ? 'ارسال کد ' : 'درحال ارسال کد...'}
      </button>
    </div>
  )
}
