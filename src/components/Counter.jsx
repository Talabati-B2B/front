import { useEffect, useState } from "react"

function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const duration = 2000
        const increment = target / (duration / 20)

        const timer = setInterval(() => {
            start += increment

            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 20)

        return () => clearInterval(timer)
    }, [target])

    return (
        <span className="text-3xl font-normal text-[#025E73]">
            +{count}{suffix}
        </span>
    )
}

export default Counter