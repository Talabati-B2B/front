import { useState } from "react";
import  Input from "./Input";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { FiLock } from "react-icons/fi"

export default function PasswordInput({
    label, 
    placeholder = "••••••••", 
    required, 
    registration ={}, 
    error
}) {
    const [show, setShow] = useState(false);

    const toggleShow = (
        <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
            aria-label={show ? " إخفاء كلمة المرور " : " إظهار كلمة المرور "}
        >
            {show ? <FaEyeSlash size={15} color="gray"/> : <FaEye size={15} color="gray"/>}
        </button>
    )
    return (
        <Input
            label={label}
            placeholder={placeholder}
            type={show ? "text" : "password"}
            icon={<FiLock size ={15} />}
            required={required}
            registration={registration}
            error={error}
            actionIcon={toggleShow}
        />
    )
}