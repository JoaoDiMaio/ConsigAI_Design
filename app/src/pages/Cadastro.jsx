import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import OnboardingBrandHeader from '../components/onboarding/OnboardingBrandHeader'
import { FontSizeToggleFloating } from '../components/FontSizeToggle'

const BENEFICIOS = [
  {
    value: 'inss',
    title: 'Aposentado ou pensionista do INSS',
    sub: 'Benefício pago pelo Instituto Nacional do Seguro Social',
  },
  {
    value: 'siape',
    title: 'Servidor público federal (SIAPE)',
    sub: 'Vínculo ativo ou inativo com órgão federal do Executivo',
  },
]

export default function Cadastro() {
  const navigate = useNavigate()
  const [beneficio, setBeneficio] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const [fields, setFields] = useState({ name: '', cpf: '', birth: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function maskCPF(v) {
    return v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  function maskPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }

  function maskDate(v) {
    return v.replace(/\D/g, '').slice(0, 8)
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
  }

  function validateCPF(cpf) {
    const d = cpf.replace(/\D/g, '')
    if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false
    let sum = 0
    for (let i = 0; i < 9; i++) sum += +d[i] * (10 - i)
    let r = (sum * 10) % 11
    if (r === 10 || r === 11) r = 0
    if (r !== +d[9]) return false
    sum = 0
    for (let i = 0; i < 10; i++) sum += +d[i] * (11 - i)
    r = (sum * 10) % 11
    if (r === 10 || r === 11) r = 0
    return r === +d[10]
  }

  function validateDate(v) {
    const [dd, mm, yyyy] = v.split('/')
    if (!dd || !mm || !yyyy || yyyy.length < 4) return false
    const d = new Date(`${yyyy}-${mm}-${dd}`)
    if (isNaN(d)) return false
    const now = new Date()
    const age = now.getFullYear() - d.getFullYear()
    return age >= 18 && age <= 120
  }

  function validate(name, value) {
    if (name === 'name') {
      if (!value.trim()) return 'Nome obrigatório'
      if (value.trim().split(' ').length < 2) return 'Informe nome e sobrenome'
    }
    if (name === 'cpf') {
      if (!value) return 'CPF obrigatório'
      if (!validateCPF(value)) return 'CPF inválido'
    }
    if (name === 'birth') {
      if (!value) return 'Data obrigatória'
      if (!validateDate(value)) return 'Data inválida ou você deve ter ao menos 18 anos'
    }
    if (name === 'phone') {
      const d = value.replace(/\D/g, '')
      if (!d) return 'Telefone obrigatório'
      if (d.length < 10) return 'Telefone incompleto'
    }
    if (name === 'email') {
      if (!value.trim()) return 'E-mail obrigatório'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido'
    }
    return null
  }

  function handleChange(name, raw, masked) {
    setFields(f => ({ ...f, [name]: masked }))
    if (touched[name]) setErrors(e => ({ ...e, [name]: validate(name, masked) }))
  }

  function handleBlur(name) {
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(e => ({ ...e, [name]: validate(name, fields[name]) }))
  }

  function handleSubmit() {
    const newTouched = { name: true, cpf: true, birth: true, phone: true, email: true }
    const newErrors = {}
    Object.keys(newTouched).forEach(k => { newErrors[k] = validate(k, fields[k]) })
    if (!beneficio) newErrors.beneficio = 'Selecione o benefício'
    setTouched(newTouched)
    setErrors(newErrors)
    const hasError = Object.values(newErrors).some(Boolean)
    if (!hasError) navigate('/upload-extrato')
  }

  return (
    <>
      <style>{`
        :root {
          --blue-dark: #002D6E;
          --blue-main: #043B8B;
          --logo-blue: #2454D6;
          --cyan: #1DA1EB;
          --green: #00A86B;
          --green-soft: #F0FFF8;
          --green-line: #BDECD7;
          --muted: #64748B;
          --line: #DDE8F6;
          --blue-soft: #F4F9FF;
          --white: #FFFFFF;
          --shadow: 0 24px 68px rgba(3, 36, 111, 0.12);
          --soft-shadow: 0 16px 38px rgba(3, 36, 111, 0.08);
        }

        .register-page * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .register-page {
          min-height: 100dvh;
          position: relative;
          display: grid;
          place-items: center;
          padding: 24px 20px;
          overflow-x: hidden;
          overflow-y: auto;
          font-family: Inter, Arial, sans-serif;
          color: var(--blue-dark);
          background: transparent;
        }

        .register-page button,
        .register-page input {
          font-family: inherit;
        }

        .register-page button {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .register-shell {
          width: min(1040px, 100%);
          height: 800px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
          overflow: hidden;
          position: relative;
          z-index: 1;
          isolation: isolate;
        }

        .register-shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--green));
          z-index: 3;
        }

        .side-panel {
          position: relative;
          padding: 38px;
          color: white;
          background:
            radial-gradient(circle at 78% 14%, rgba(0, 231, 255, 0.18), transparent 32%),
            radial-gradient(circle at 12% 90%, rgba(0, 122, 82, 0.16), transparent 28%),
            linear-gradient(145deg, #06184E 0%, #03246F 58%, #055ECE 100%);
          overflow: hidden;
        }

        .side-panel::before {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          left: -110px;
          top: -110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 231, 255, 0.18), transparent 66%);
        }

        .side-panel::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          right: -210px;
          bottom: -180px;
          border-radius: 50%;
          background:
            conic-gradient(
              from 40deg,
              rgba(0, 231, 255, 0.22),
              rgba(29, 161, 235, 0.08),
              rgba(255, 255, 255, 0.08),
              rgba(0, 231, 255, 0.22)
            );
          opacity: 0.82;
        }

        .side-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: grid;
          align-content: space-between;
          gap: 32px;
        }

        .side-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #DDE8F6;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .side-kicker::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 12px rgba(0, 231, 255, 0.85);
        }

        .side-title {
          margin-top: 24px;
          max-width: 470px;
          color: white;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.075em;
        }

        .side-title span {
          color: #A9FFD8;
        }

        .side-copy {
          max-width: 450px;
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 15px;
          line-height: 1.5;
          font-weight: 650;
        }

        .bottom-section {
          display: grid;
          gap: 28px;
        }

        .coverage-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          max-width: 440px;
          width: 100%;
        }

        .coverage-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        .coverage-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .coverage-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
          font-size: 13px;
          font-weight: 900;
          color: white;
          letter-spacing: 0.01em;
          width: 100%;
        }

        .coverage-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex: 0 0 auto;
        }

        .coverage-badge-dot.inss {
          background: var(--cyan);
          box-shadow: 0 0 8px rgba(0,231,255,0.7);
        }

        .coverage-badge-dot.siape {
          background: #7BDFB0;
          box-shadow: 0 0 8px rgba(0,200,130,0.6);
        }

        .coverage-badge-sub {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.04em;
        }

        .steps-preview {
          display: grid;
          gap: 10px;
          max-width: 440px;
        }

        .step-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(10px);
        }

        .step-number {
          width: 44px;
          height: 44px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          background: transparent;
          border: 0;
          padding: 0;
        }

        .step-number svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .step-row > div {
          display: grid;
          align-content: center;
        }

        .step-row strong {
          display: block;
          color: white;
          font-size: 12px;
          line-height: 1.15;
          font-weight: 950;
        }

        .step-row span {
          display: block;
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
          line-height: 1.35;
          font-weight: 650;
        }

        .form-panel {
          padding: 42px;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.08), transparent 36%),
            linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
        }

        .form-box {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .form-box::-webkit-scrollbar {
          display: none;
        }


        .progress-bar-track {
          width: 72px;
          height: 6px;
          border-radius: 999px;
          background: #DDE8F6;
          margin-top: 12px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--blue-main), var(--cyan));
        }

        .form-kicker {
          color: var(--blue-main);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .form-title {
          margin-top: 8px;
          color: var(--blue-dark);
          font-size: 34px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .form-title span { color: var(--green); }

        .form-copy {
          margin-top: 10px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.45;
          font-weight: 650;
        }

        .personal-card {
          margin-top: 22px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .field-group.full {
          grid-column: 1 / -1;
        }

        .field-group label {
          display: flex;
          gap: 4px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1;
          font-weight: 850;
          margin-bottom: 8px;
        }

        .field-group label span {
          color: var(--blue-main);
        }

        .input-field {
          min-height: 54px;
          width: 100%;
          padding: 0 16px;
          border-radius: 21px;
          border: 1px solid var(--line);
          background: #F8FBFF;
          color: var(--blue-dark);
          font-size: 14px;
          font-weight: 750;
          outline: none;
          transition: 160ms ease;
        }

        .input-field::placeholder {
          color: #8A9AB8;
        }

        .input-field:focus {
          border-color: var(--blue-main);
          background: white;
          box-shadow: 0 0 0 4px rgba(4, 59, 139, 0.1);
        }

        .input-field.error {
          border-color: #E53E3E;
          background: #FFF5F5;
          box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1);
        }

        .field-error {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #E53E3E;
        }

        .field-error::before {
          content: "!";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #E53E3E;
          color: white;
          font-size: 10px;
          font-weight: 900;
          flex: 0 0 auto;
        }

        .beneficio-dropdown {
          position: relative;
          user-select: none;
        }

        .beneficio-trigger {
          min-height: 54px;
          width: 100%;
          padding: 0 16px;
          border-radius: 21px;
          border: 1px solid var(--line);
          background: #F8FBFF;
          color: var(--blue-dark);
          font-size: 14px;
          font-weight: 750;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: 160ms ease;
          font-family: inherit;
        }

        .beneficio-trigger.placeholder {
          color: #8A9AB8;
          font-weight: 500;
        }

        .beneficio-trigger.error {
          border-color: #E53E3E;
          background: #FFF5F5;
          box-shadow: 0 0 0 4px rgba(229,62,62,0.1);
        }

        .beneficio-trigger.open,
        .beneficio-trigger:focus-visible {
          border-color: var(--logo-blue);
          background: white;
          box-shadow: 0 0 0 4px rgba(29, 161, 235, 0.12);
        }

        .beneficio-chevron {
          flex: 0 0 auto;
          width: 18px;
          height: 18px;
          color: #8A9AB8;
          transition: transform 200ms ease;
        }

        .beneficio-trigger.open .beneficio-chevron {
          transform: rotate(180deg);
          color: var(--logo-blue);
        }

        .beneficio-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          z-index: 50;
          background: white;
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: 0 16px 40px rgba(3, 36, 111, 0.12);
          overflow: hidden;
          animation: dropdownOpen 160ms ease;
        }

        @keyframes dropdownOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .beneficio-option {
          padding: 14px 16px;
          cursor: pointer;
          transition: background 120ms ease;
          border-bottom: 1px solid #F0F5FF;
        }

        .beneficio-option:last-child {
          border-bottom: none;
        }

        .beneficio-option:hover {
          background: #F4F8FF;
        }

        .beneficio-option.selected {
          background: #EEF5FF;
        }

        .beneficio-option-title {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color: var(--blue-dark);
          line-height: 1.2;
        }

        .beneficio-option-sub {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          line-height: 1.3;
        }

        .security-card {
          margin-top: 26px;
          padding: 14px 16px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 92% 8%, rgba(0, 122, 82, 0.08), transparent 34%),
            var(--green-soft);
          border: 1px solid var(--green-line);
          box-shadow: var(--soft-shadow);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--green);
        }

        .security-icon {
          width: 30px;
          height: 30px;
          flex: 0 0 auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.66);
          border: 1px solid var(--green-line);
          font-size: 14px;
          font-weight: 950;
        }

        .security-card strong {
          display: block;
          color: var(--green);
          font-size: 13px;
          line-height: 1.2;
          font-weight: 950;
        }

        .security-card span {
          display: block;
          margin-top: 3px;
          color: #0E7353;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 650;
        }

        .actions {
          margin-top: 26px;
          display: grid;
          gap: 12px;
        }

        .primary-cta {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 18px;
          background: linear-gradient(145deg, var(--blue-main), var(--blue-dark));
          color: white;
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 16px 32px rgba(4, 59, 139, 0.22);
        }

        .secondary-cta {
          width: 100%;
          min-height: 54px;
          border-radius: 21px;
          border: 1px solid #DDE8F6;
          background: transparent;
          color: var(--blue-main);
          font-size: 15px;
          font-weight: 950;
        }

        .primary-cta:focus-visible,
        .secondary-cta:focus-visible,
        .login-note button:focus-visible {
          outline: 3px solid rgba(29, 161, 235, 0.35);
          outline-offset: 2px;
        }

        .consigai-cta-animated {
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-position .35s ease, filter .18s ease;
          animation: consigaiDetailsFloat 3.8s ease-in-out infinite;
          background-size: 220% 100%;
          background-position: 0% 0%;
        }

        .consigai-cta-animated:hover {
          background-position: 100% 0%;
          animation-play-state: paused;
          transform: translateY(-2px) scale(1.01) !important;
          filter: saturate(1.05);
        }

        .consigai-cta-animated:active {
          transform: translateY(0) scale(.985);
        }

        .consigai-cta-animated::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 60%);
          transform: translateX(-120%) skewX(-18deg);
          opacity: 0;
          pointer-events: none;
        }

        .consigai-cta-animated:hover::after {
          opacity: 1;
          animation: consigaiDetailsShine .9s ease forwards;
        }

        @keyframes consigaiDetailsFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }

        @keyframes consigaiDetailsShine {
          0% { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(120%) skewX(-18deg); }
        }

        @keyframes mobileCtaSelect {
          0% { transform: translateY(0) scale(1); }
          45% { transform: translateY(2px) scale(0.982); }
          100% { transform: translateY(0) scale(1); }
        }

        .login-note {
          margin-top: 22px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.4;
          font-weight: 650;
        }

        .login-note button {
          color: var(--blue-main);
          font-weight: 950;
          text-decoration: none;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
        }

        @media (max-width: 920px) {
          .register-page {
            place-items: start center;
          }

          .register-shell {
            grid-template-columns: 1fr;
            height: auto;
          }

          .form-panel {
            order: 1;
            padding: 30px 28px;
          }

          .side-panel {
            order: 2;
            min-height: 260px;
            padding: 28px;
          }

          .side-content {
            gap: 22px;
          }

          .steps-preview {
            gap: 8px;
          }

          .consigai-cta-animated,
          .consigai-cta-animated:hover,
          .consigai-cta-animated:active,
          .consigai-cta-animated:hover::after {
            animation: none !important;
            transform: none !important;
            filter: none !important;
          }
        }

        @media (max-width: 560px) {
          .register-page {
            padding: 12px;
          }

          .register-shell {
            border-radius: 22px;
          }

          .side-panel,
          .form-panel {
            padding: 18px;
          }

          .side-panel {
            min-height: 200px;
            padding-bottom: 16px;
          }

          .side-content {
            gap: 14px;
          }

          .side-kicker {
            display: none;
          }

          .side-title {
            margin-top: 16px;
            font-size: clamp(29px, 8.2vw, 36px);
          }

          .form-box {
            max-width: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .input-field {
            min-height: 50px;
            border-radius: 14px;
            font-size: 16px;
          }

          .personal-card {
            margin-top: 18px;
          }

          .step-row {
            padding: 8px 10px;
            border-radius: 12px;
          }

          .step-number {
            width: 34px;
            height: 34px;
          }

          .step-row strong {
            font-size: 11px;
          }

          .step-row span {
            font-size: 10px;
          }

          .security-card {
            margin-top: 18px;
            border-radius: 16px;
            padding: 12px;
          }

          .primary-cta,
          .secondary-cta {
            min-height: 52px;
            font-size: 16px;
            border-radius: 15px;
            transition: transform .15s ease, box-shadow .2s ease, filter .2s ease, background-color .2s ease;
            will-change: transform;
          }

          .primary-cta:active,
          .secondary-cta:active {
            animation: mobileCtaSelect .24s ease;
            transform: translateY(2px) scale(0.982);
            box-shadow: 0 6px 14px rgba(5, 94, 206, 0.2);
            filter: saturate(0.96);
          }

          .primary-cta:focus-visible,
          .secondary-cta:focus-visible {
            animation: mobileCtaSelect .24s ease;
          }

          .login-note {
            margin-top: 16px;
            font-size: 12px;
          }

          .steps-preview {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .side-panel {
            min-height: 170px;
          }

          .side-title {
            font-size: 28px;
            letter-spacing: -0.05em;
            line-height: 1;
          }

          .side-copy {
            display: none;
          }

          .steps-preview {
            display: none;
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .consigai-cta-animated,
          .consigai-cta-animated:hover::after {
            animation: none !important;
          }
        }
      `}</style>

      <FontSizeToggleFloating />
      <main className="register-page">
        <section className="register-shell" aria-label="Cadastro ConsigAI">
          <aside className="side-panel">
            <div className="side-content">
              <div>
                <div className="side-kicker">Cadastro seguro</div>
                <h1 className="side-title">Primeiro, vamos confirmar sua <span style={{ color: '#00E7FF' }}>Identidade</span></h1>
                <p className="side-copy">
                  Usamos seus dados apenas para localizar contratos elegíveis e mostrar ofertas com clareza, segurança e transparência.
                </p>

              </div>

              <div className="bottom-section">
                <div className="coverage-row">
                  <span className="coverage-label">Atendemos</span>
                  <div className="coverage-badges">
                    <span className="coverage-badge">
                      <span className="coverage-badge-dot inss" />
                      Aposentados e pensionistas do INSS
                      <span className="coverage-badge-sub">INSS</span>
                    </span>
                    <span className="coverage-badge">
                      <span className="coverage-badge-dot siape" />
                      Servidores públicos federais
                      <span className="coverage-badge-sub">SIAPE</span>
                    </span>
                  </div>
                </div>

                <div className="steps-preview">
                <div className="step-row">
                  <span className="step-number" aria-hidden="true">
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="consigaiOneGradientLeft" x1="28" y1="18" x2="66" y2="78" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#00E7FF" />
                          <stop offset="0.45" stopColor="#1DA1EB" />
                          <stop offset="1" stopColor="#055ECE" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M51 18 C52.8 18 54.2 19.4 54.2 21.2 V75 C54.2 76.8 52.8 78.2 51 78.2 H43.8 C42 78.2 40.6 76.8 40.6 75 V33.8 L33.6 38.2 C32 39.2 30 38.7 29.1 37.1 L25.9 31.8 C25 30.3 25.5 28.3 27.1 27.4 L42.5 18.6 C43.1 18.2 43.9 18 44.7 18 H51Z"
                        fill="url(#consigaiOneGradientLeft)"
                      />
                    </svg>
                  </span>
                  <div>
                    <strong>Dados pessoais</strong>
                    <span>Confirmamos quem você é antes de buscar contratos.</span>
                  </div>
                </div>

                <div className="step-row">
                  <span className="step-number" aria-hidden="true">
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="consigaiTwoGradientLeft" x1="26" y1="18" x2="70" y2="78" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#00E7FF" />
                          <stop offset="0.45" stopColor="#1DA1EB" />
                          <stop offset="1" stopColor="#055ECE" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M27 75 C27 72.8 27.8 70.9 29.3 69.4 L50.8 48.2 C55.4 43.6 57.4 40.5 57.4 36.7 C57.4 32.2 54.1 29.3 49 29.3 C44.1 29.3 40.7 32.1 39.5 36.6 C39 38.5 37.2 39.7 35.3 39.2 L29.1 37.8 C27.1 37.3 25.9 35.3 26.5 33.3 C29.2 23.7 37.6 18 49.4 18 C63.2 18 72.4 25.4 72.4 36.2 C72.4 43.7 68.9 49.4 61.5 56.3 L48.6 68.3 H69.6 C71.6 68.3 73.2 69.9 73.2 71.9 V75 C73.2 77 71.6 78.6 69.6 78.6 H30.6 C28.6 78.6 27 77 27 75Z"
                        fill="url(#consigaiTwoGradientLeft)"
                      />
                    </svg>
                  </span>
                  <div>
                    <strong>Análise ConsigAI</strong>
                    <span>Nossa inteligência compara cenários de economia, parcela e crédito.</span>
                  </div>
                </div>

                <div className="step-row">
                  <span className="step-number" aria-hidden="true">
                    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="consigaiThreeGradientLeft" x1="25" y1="18" x2="72" y2="78" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#00E7FF" />
                          <stop offset="0.45" stopColor="#1DA1EB" />
                          <stop offset="1" stopColor="#055ECE" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M48.6 79 C36.2 79 27.2 73.2 24.4 63.6 C23.8 61.6 25 59.6 27 59.1 L33.4 57.6 C35.2 57.2 37 58.2 37.7 60 C39.2 64.5 42.8 67.2 48.2 67.2 C54.2 67.2 58.2 64.1 58.2 59.2 C58.2 54 54.4 51.3 47.3 51.3 H42.5 C40.6 51.3 39.1 49.8 39.1 47.9 V42.8 C39.1 40.9 40.6 39.4 42.5 39.4 H47.1 C53.5 39.4 56.9 36.8 56.9 32.3 C56.9 28.1 53.5 25.5 48.4 25.5 C43.5 25.5 40.2 27.9 38.8 32 C38.2 33.8 36.4 34.8 34.6 34.4 L28.4 32.9 C26.4 32.4 25.2 30.4 25.9 28.4 C28.9 19.7 37.2 14.5 48.8 14.5 C62.7 14.5 72 21 72 31.5 C72 38.5 68.3 43.8 62.1 46.2 C69.4 48.7 73.4 54.3 73.4 61.8 C73.4 72.4 63.6 79 48.6 79Z"
                        fill="url(#consigaiThreeGradientLeft)"
                      />
                    </svg>
                  </span>
                  <div>
                    <strong>Oferta transparente</strong>
                    <span>Você vê parcela, prazo, taxa e custo antes de decidir.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </aside>

          <section className="form-panel">
            <OnboardingBrandHeader showStepBadge stepLabel="Etapa 1 de 2" stepProgress={50} />
            <div className="form-box">
              <div className="form-kicker">Etapa 1 — Dados pessoais</div>

              <form className="personal-card" onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid">
                  <div className="field-group full">
                    <label>Qual é o seu benefício? <span>*</span></label>
                    <div className="beneficio-dropdown" ref={dropdownRef}>
                      <button
                        type="button"
                        className={`beneficio-trigger${dropdownOpen ? ' open' : ''}${!beneficio ? ' placeholder' : ''}${errors.beneficio ? ' error' : ''}`}
                        onClick={() => setDropdownOpen(o => !o)}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                      >
                        <span>{beneficio ? beneficio.title : 'Selecione seu benefício'}</span>
                        <svg className="beneficio-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {dropdownOpen && (
                        <div className="beneficio-menu" role="listbox">
                          {BENEFICIOS.map(b => (
                            <div
                              key={b.value}
                              className={`beneficio-option${beneficio?.value === b.value ? ' selected' : ''}`}
                              role="option"
                              aria-selected={beneficio?.value === b.value}
                              onClick={() => { setBeneficio(b); setDropdownOpen(false); setErrors(e => ({ ...e, beneficio: null })) }}
                            >
                              <span className="beneficio-option-title">{b.title}</span>
                              <span className="beneficio-option-sub">{b.sub}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.beneficio && <span className="field-error">{errors.beneficio}</span>}
                  </div>

                  <div className="field-group full">
                    <label htmlFor="name">Nome completo <span>*</span></label>
                    <input
                      id="name" type="text" placeholder="Como aparece no documento"
                      className={`input-field${errors.name && touched.name ? ' error' : ''}`}
                      value={fields.name}
                      onChange={e => handleChange('name', e.target.value, e.target.value)}
                      onBlur={() => handleBlur('name')}
                    />
                    {errors.name && touched.name && <span className="field-error">{errors.name}</span>}
                  </div>

                  <div className="field-group">
                    <label htmlFor="cpf">CPF <span>*</span></label>
                    <input
                      id="cpf" type="text" placeholder="000.000.000-00" inputMode="numeric"
                      className={`input-field${errors.cpf && touched.cpf ? ' error' : ''}`}
                      value={fields.cpf}
                      onChange={e => handleChange('cpf', e.target.value, maskCPF(e.target.value))}
                      onBlur={() => handleBlur('cpf')}
                    />
                    {errors.cpf && touched.cpf && <span className="field-error">{errors.cpf}</span>}
                  </div>

                  <div className="field-group">
                    <label htmlFor="birth">Data de nascimento <span>*</span></label>
                    <input
                      id="birth" type="text" placeholder="DD/MM/AAAA" inputMode="numeric"
                      className={`input-field${errors.birth && touched.birth ? ' error' : ''}`}
                      value={fields.birth}
                      onChange={e => handleChange('birth', e.target.value, maskDate(e.target.value))}
                      onBlur={() => handleBlur('birth')}
                    />
                    {errors.birth && touched.birth && <span className="field-error">{errors.birth}</span>}
                  </div>

                  <div className="field-group">
                    <label htmlFor="phone">Telefone / WhatsApp <span>*</span></label>
                    <input
                      id="phone" type="tel" placeholder="(00) 00000-0000" inputMode="tel"
                      className={`input-field${errors.phone && touched.phone ? ' error' : ''}`}
                      value={fields.phone}
                      onChange={e => handleChange('phone', e.target.value, maskPhone(e.target.value))}
                      onBlur={() => handleBlur('phone')}
                    />
                    {errors.phone && touched.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="field-group">
                    <label htmlFor="email">E-mail <span>*</span></label>
                    <input
                      id="email" type="email" placeholder="seu@email.com"
                      className={`input-field${errors.email && touched.email ? ' error' : ''}`}
                      value={fields.email}
                      onChange={e => handleChange('email', e.target.value, e.target.value)}
                      onBlur={() => handleBlur('email')}
                    />
                    {errors.email && touched.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>
              </form>

              <div className="actions">
                <button className="primary-cta consigai-cta-animated" type="button" onClick={handleSubmit}>Continuar</button>
                <button className="secondary-cta consigai-cta-animated" type="button" onClick={() => navigate('/entrada')}>Voltar para entrada</button>
              </div>

              <p className="login-note">
                Já tem conta? <button type="button" onClick={() => navigate('/entrada')}>Entrar</button>
              </p>
            </div>
          </section>
        </section>
      </main>
    </>
  )
}
