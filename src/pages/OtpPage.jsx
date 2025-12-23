import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function OtpPage() {
  // -----------------------------
  // دریافت اطلاعات از صفحه قبل (PhonePage)
  // -----------------------------
  const location = useLocation()
  const navigate = useNavigate()
  const phone = location.state?.phone  // شماره تلفنی که کاربر وارد کرد

  // -----------------------------
  // state برای OTP: آرایه ۵ رقمی
  // -----------------------------
  const [otp, setOtp] = useState(['', '', '', '', ''])

  // -----------------------------
  // state برای تایمر (بر حسب ثانیه)
  // -----------------------------
  const [time, setTime] = useState(120)

  // -----------------------------
  // state برای لودینگ هنگام ارسال OTP
  // -----------------------------
  const [loading, setLoading] = useState(false)

  // -----------------------------
  // state برای نمایش خطا (کد اشتباه یا شبکه)
  // -----------------------------
  const [error, setError] = useState('')

  // -----------------------------
  // ref برای دسترسی به input ها و مدیریت فوکوس
  // -----------------------------
  const inputsRef = useRef([])

  // -----------------------------
  // useEffect برای اجرای تایمر هر ثانیه
  // -----------------------------
  useEffect(() => {
    if (time <= 0) return
    const timer = setInterval(() => {
      setTime(prev => prev - 1)
    }, 1000)

    // پاک کردن interval هنگام unmount یا تغییر time
    return () => clearInterval(timer)
  }, [time])

  // -----------------------------
  // تغییر مقادیر OTP و مدیریت فوکوس خودکار
  // -----------------------------
  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return  // فقط اعداد را قبول کن

    const newOtp = [...otp]
    newOtp[idx] = val
    setOtp(newOtp)

    // اگر رقم وارد شد و آخرین input نیست، فوکوس به input بعدی می‌رود
    if (val && idx < 4) {
      inputsRef.current[idx + 1].focus()
    }
  }

  // -----------------------------
  // تابع ارسال OTP به سرور برای اعتبارسنجی
  // -----------------------------
  const submitHandler = async () => {
    const code = otp.join('')  // ترکیب آرایه OTP به رشته

    // بررسی طول کد (۵ رقم)
    if (code.length !== 5) {
      setError('کد باید ۵ رقم باشد')
      return
    }

    setLoading(true)  // شروع لودینگ
    setError('')      // پاک کردن خطاهای قبلی

    try {
      // ارسال درخواست POST به API login
      const res = await fetch(
        'https://apigw.stage.tala.land/idp/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Username: phone,
            Code: code,
          }),
        }
      )

      // تبدیل پاسخ سرور به آبجکت JS
      const data = await res.json()

      if (data.success) {
        // موفقیت: هدایت کاربر به داشبورد بدون alert
        navigate('/dashboard')
      } else {
        // ناموفق: پیام خطا و پاک کردن OTP
        setError('کد وارد شده نادرست است')
        setOtp(['', '', '', '', ''])
        inputsRef.current[0].focus() // فوکوس روی اولین input
      }
    } catch {
      // مشکل شبکه
      setError('مشکل شبکه')
    } finally {
      // در هر حالت لودینگ خاموش شود
      setLoading(false)
    }
  }

  // -----------------------------
  // فرمت کردن تایمر به mm:ss
  // -----------------------------
  const formatTime = (t) => {
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <div className="container">
      {/* عنوان و توضیح */}
      <h2 className="title">تایید شماره تماس</h2>
      <p className="subtitle">
        کد ارسال شده به {phone} را وارد کنید
      </p>

      {/* نمایش تایمر */}
      <div className="timer">
        زمان باقی‌مانده: {formatTime(time)}
      </div>

      {/* ورودی OTP */}
      <div className="otp-container">
        {otp.map((val, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={val}
            ref={(el) => (inputsRef.current[idx] = el)}
            onChange={(e) =>
              handleChange(idx, e.target.value)
            }
          />
        ))}
      </div>

      {/* نمایش پیام خطا */}
      {error && <p className="error">{error}</p>}

      {/* دکمه تأیید */}
      <button
        className="btn"
        onClick={submitHandler}
        disabled={loading || time <= 0}
      >
        {loading ? 'در حال بررسی...' : 'تأیید'}
      </button>

      {/* ارسال دوباره کد اگر تایمر تمام شد */}
      {time <= 0 && (
        <button
          className="btn"
          onClick={() => setTime(120)}
        >
          ارسال دوباره کد
        </button>
      )}
    </div>
  )
}
