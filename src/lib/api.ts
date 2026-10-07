const API_URL = import.meta.env.VITE_API_URL

type WaitlistResponse = {
    message: string
}

export async function addToWaitlist(
    email: string,
): Promise<WaitlistResponse> {
    const response = await fetch(`${API_URL}/api/waitlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
        }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const error = new Error(
            data?.message ?? "No se pudo completar la solicitud.",
        )

        Object.assign(error, {
            status: response.status,
            code: data?.code,
        })

        throw error
    }

    return data
}