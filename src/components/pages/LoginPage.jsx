import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { superAdminLogin } from '@/services/api'
import { Eye, EyeOff, } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await superAdminLogin(form)
      login(data.token, data.admin)
      navigate('/')
    } catch (err) {
      console.log('Full Error:', err);
      console.log('Response:', err.response);
      console.log('Data:', err.response?.data);

      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false)
    }
  }

  return (

    <div
      className=" min-h-screen bg-[#F4F7FB] flex items-center justify-center relative
       overflow-hidden "
    >

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            top-[-10%]
            left-[-5%]
            w-[500px]
            h-[500px]
            rounded-full
            bg-blue-100/60
            blur-3xl
          "
        />

        <div
          className=" absolute bottom-[-10%] right-[-5%] w-[420px] h-[420px] rounded-full
           bg-violet-100/50  blur-3xl"
        />

      </div>

      {/* LOGIN */}
      <div
        className="  relative  w-full  max-w-sm  mx-4"
      >

        {/* LOGO */}
        <div className="text-center mb-8">

          <div
            className=" inline-flex w-16 h-16 items-center justify-center
              rounded-2xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(59,130,246,0.20)]         mb-3
            "
          >
            <img
              src="/src/public/images/flairm-crm-logo.png"
              alt="Flairm"
              className="w-10 h-10 object-contain"
            />
          </div>

          <h1
            className="  text-3xl  font-black  tracking-tight  text-slate-900"
          >
            Flairm
          </h1>

          <p
            className="  text-xs  text-slate-500  uppercase  tracking-[0.25em]  mt-2  font-bold"
          >
            Super Admin Portal
          </p>

        </div>

        {/* CARD */}
        <div
          className=" bg-white/90  backdrop-blur-xl  border  border-slate-200/70  rounded-3xl 
           p-8  shadow-[0_10px_40px_rgba(15,23,42,0.08)]"
        >

          <div className="mb-7">

            <h2
              className="  text-2xl  font-black  text-slate-900  tracking-tight"
            >
              Welcome back
            </h2>

            <p className="text-sm  text-slate-500  mt-1">
              Sign in to manage your platform
            </p>

          </div>

          {/* ERROR */}
          {error && (

            <div
              className="
                mb-5
                px-4
                py-3
                rounded-xl
                bg-red-50
                border
                border-red-200
                text-sm
                text-red-600
                font-medium
              "
            >
              {error}
            </div>

          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-[0.15em]
                  mb-2
                "
              >
                Email
              </label>

              <input
                type="email"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                  text-slate-900
                  text-sm
                  font-medium
                  placeholder:text-slate-400
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-blue-500
                  transition-all
                "
                placeholder="company@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value, })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div>

              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-[0.15em]
                  mb-2
                "
              >
                Password
              </label>

              <div className="relative">

                <input
                  type={showPass ? 'text' : 'password'}
                  className="
                    w-full
                    h-12
                    px-4
                    pr-11
                    rounded-xl
                    bg-slate-50
                    border
                    border-slate-200
                    text-slate-900
                    text-sm
                    font-medium
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-500
                    transition-all
                  "
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value, })
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-slate-700
                    transition-colors
                  "
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}

                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                to-violet-500
                text-white
                font-bold
                text-sm
                shadow-lg
                shadow-blue-200/40
                hover:opacity-95
                transition-all
                disabled:opacity-50
              "
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p
          className="
            text-center
            text-xs
            text-slate-400
            mt-6
          "
        >
          Flairm Platform ©{' '}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}