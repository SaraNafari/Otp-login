import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import "../styles/auth.css";


export default function OtpPage() {
  const location = useLocation()
  const phone = location.state?.phone

  const [otp, setOtp] = useState(['', '', '', '', ''])
  const [time, setTime] = useState(120)
  const inputsRef = useRef([])

  useEffect(() => {
    if (time <= 0) return
    const timer = setInterval(() => setTime(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [time])

  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[idx] = val
    setOtp(newOtp)
    if (val && idx < 4) inputsRef.current[idx + 1].focus()
  }

  const submitHandler = async () => {
    const code = otp.join('')
    if (code.length !== 5) {
      alert('کد باید ۵ رقم باشد')
      return
    }

    try {
      const res = await fetch('https://apigw.stage.tala.land/idp/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: phone, Code: code }),
      })

      if (res.ok) alert('ورود موفق ')
      else alert('کد اشتباه است')
    } catch {
      alert('مشکل شبکه')
    }
  }

  const formatTime = (t) => {
    const m = Math.floor(t/60)
    const s = t%60
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }

  return (
    <div className="container">
      <h2 className="title">تایید شماره تماس</h2>
      <p className="subtitle">کد ارسال شده به {phone} را وارد کنید </p>

      <div className="timer">زمان باقی‌مانده: {formatTime(time)}</div>

      <div className="otp-container">
        {otp.map((val, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={val}
            ref={el => inputsRef.current[idx] = el}
            onChange={e => handleChange(idx, e.target.value)}
          />
        ))}
      </div>

      <button className="btn" onClick={submitHandler} disabled={time <= 0}>تأیید</button>

      {time <= 0 && <button className="btn" onClick={() => setTime(120)}>ارسال دوباره کد</button>}
    </div>
  )
}
