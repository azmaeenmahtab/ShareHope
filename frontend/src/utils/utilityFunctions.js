export const fetchUserData = async () => {
    try {
        const apiBase = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(apiBase + "/api/auth/login", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({}),
        });

        
    } catch (error) {
        console.error("Error fetching user data:", error);
        
    }
}